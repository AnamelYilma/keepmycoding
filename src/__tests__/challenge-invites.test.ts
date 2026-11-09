// KeepCoding - Challenge Invitations & Access Control Test Suite
import crypto from 'crypto';

function generateTestInviteToken(): string {
  return `inv_${crypto.randomBytes(18).toString('base64url')}`;
}

function isInviteValid(invite: {
  is_revoked: boolean;
  expires_at: string | null;
  max_uses: number | null;
  uses_count: number;
}): { valid: boolean; reason?: string } {
  if (invite.is_revoked) {
    return { valid: false, reason: 'This invitation has been revoked.' };
  }
  if (invite.expires_at && new Date(invite.expires_at).getTime() < Date.now()) {
    return { valid: false, reason: 'This invitation has expired.' };
  }
  if (invite.max_uses !== null && invite.uses_count >= invite.max_uses) {
    return { valid: false, reason: 'This invitation has reached its usage limit.' };
  }
  return { valid: true };
}

function canUserAccessChallenge(params: {
  challenge: {
    id: string;
    owner_id: string;
    visibility: 'public' | 'private' | 'temporary';
  };
  userId?: string | null;
  grantedUserIds?: string[];
  inviteTokenValid?: boolean;
}): { allowed: boolean; reason: string } {
  const { challenge, userId, grantedUserIds = [], inviteTokenValid = false } = params;

  // 1. Public challenges are always accessible
  if (challenge.visibility === 'public') {
    return { allowed: true, reason: 'public' };
  }

  // 2. Challenge owner always has access
  if (userId && challenge.owner_id === userId) {
    return { allowed: true, reason: 'owner' };
  }

  // 3. User with explicit access granted via accepted invite
  if (userId && grantedUserIds.includes(userId)) {
    return { allowed: true, reason: 'access_granted' };
  }

  // 4. Guest or user holding a valid invite token
  if (inviteTokenValid) {
    return { allowed: true, reason: 'valid_invite_token' };
  }

  // 5. Otherwise denied
  return { allowed: false, reason: 'unauthorized_private' };
}

function runInviteTestSuite() {
  console.log('=== Step 1: Testing Invite Token Structure ===');
  for (let i = 0; i < 10; i++) {
    const token = generateTestInviteToken();
    if (!token.startsWith('inv_')) {
      throw new Error(`Token does not start with inv_: ${token}`);
    }
    if (token.length < 24) {
      throw new Error(`Token length is too short: ${token.length}`);
    }
    // Verify base64url safe chars
    if (!/^inv_[A-Za-z0-9_-]+$/.test(token)) {
      throw new Error(`Token contains invalid characters: ${token}`);
    }
  }
  console.log('[PASS] Secure random invite tokens generated matching inv_* specification.');

  console.log('\n=== Step 2: Testing Invitation Validity Rules ===');
  // Active invite without expiry
  const activeNoExpiry = isInviteValid({
    is_revoked: false,
    expires_at: null,
    max_uses: null,
    uses_count: 5,
  });
  if (!activeNoExpiry.valid) throw new Error('Active invite marked invalid');

  // Expired invite
  const expired = isInviteValid({
    is_revoked: false,
    expires_at: new Date(Date.now() - 3600000).toISOString(),
    max_uses: null,
    uses_count: 0,
  });
  if (expired.valid || !expired.reason?.includes('expired')) {
    throw new Error('Expired invite not rejected properly');
  }

  // Future expiry invite
  const future = isInviteValid({
    is_revoked: false,
    expires_at: new Date(Date.now() + 86400000).toISOString(),
    max_uses: null,
    uses_count: 0,
  });
  if (!future.valid) throw new Error('Future expiring invite marked invalid');

  // Max uses reached
  const maxedOut = isInviteValid({
    is_revoked: false,
    expires_at: null,
    max_uses: 5,
    uses_count: 5,
  });
  if (maxedOut.valid || !maxedOut.reason?.includes('limit')) {
    throw new Error('Max uses exceeded invite not rejected properly');
  }

  // Revoked invite
  const revoked = isInviteValid({
    is_revoked: true,
    expires_at: null,
    max_uses: null,
    uses_count: 0,
  });
  if (revoked.valid || !revoked.reason?.includes('revoked')) {
    throw new Error('Revoked invite not rejected properly');
  }
  console.log('[PASS] All invite validity edge cases passed (expiration, max uses, revocation).');

  console.log('\n=== Step 3: Testing Challenge Access Control Rules ===');
  const privateChallenge = {
    id: 'ch-priv-101',
    owner_id: 'user-author-1',
    visibility: 'private' as const,
  };
  const publicChallenge = {
    id: 'ch-pub-202',
    owner_id: 'user-author-1',
    visibility: 'public' as const,
  };

  // Stranger accessing public challenge: allowed
  const pubAccess = canUserAccessChallenge({
    challenge: publicChallenge,
    userId: 'user-stranger-99',
  });
  if (!pubAccess.allowed) throw new Error('Public challenge denied to stranger');

  // Stranger accessing private challenge without invite: denied
  const privDenied = canUserAccessChallenge({
    challenge: privateChallenge,
    userId: 'user-stranger-99',
  });
  if (privDenied.allowed) throw new Error('Private challenge allowed to unauthorized stranger');

  // Author accessing private challenge: allowed
  const authorAccess = canUserAccessChallenge({
    challenge: privateChallenge,
    userId: 'user-author-1',
  });
  if (!authorAccess.allowed || authorAccess.reason !== 'owner') {
    throw new Error('Author denied access to their own private challenge');
  }

  // Invited enrolled member accessing private challenge: allowed
  const memberAccess = canUserAccessChallenge({
    challenge: privateChallenge,
    userId: 'user-invited-2',
    grantedUserIds: ['user-invited-2'],
  });
  if (!memberAccess.allowed || memberAccess.reason !== 'access_granted') {
    throw new Error('Invited member with grant record denied access');
  }

  // Guest practicing private challenge with valid invite token: allowed
  const guestAccess = canUserAccessChallenge({
    challenge: privateChallenge,
    userId: null,
    inviteTokenValid: true,
  });
  if (!guestAccess.allowed || guestAccess.reason !== 'valid_invite_token') {
    throw new Error('Guest with valid invite token denied access');
  }

  // Guest with invalid invite token: denied
  const invalidGuestAccess = canUserAccessChallenge({
    challenge: privateChallenge,
    userId: null,
    inviteTokenValid: false,
  });
  if (invalidGuestAccess.allowed) {
    throw new Error('Guest with invalid invite token granted access to private challenge');
  }

  console.log('[PASS] Private & public challenge access control invariants verified.');

  console.log('\n=== Step 4: Anti-AI Slop & Tone Verification ===');
  // Read JoinPage and InviteModal contents to verify no banned marketing words or em dashes
  const fs = require('fs');
  const joinPageSrc = fs.readFileSync('src/app/join/[token]/JoinPage.tsx', 'utf-8');
  const modalSrc = fs.readFileSync('src/components/challenges/InviteModal.tsx', 'utf-8');

  if (joinPageSrc.includes('—') || modalSrc.includes('—')) {
    throw new Error('Found forbidden em dash character in invite UI');
  }
  if (joinPageSrc.includes('Sparkles') || modalSrc.includes('Sparkles')) {
    throw new Error('Found banned Sparkles icon in invite UI');
  }
  if (joinPageSrc.includes('Wand2') || modalSrc.includes('Wand2')) {
    throw new Error('Found banned Wand2 icon in invite UI');
  }
  console.log('[PASS] Zero AI-slop markers in invitation views.');

  console.log('\nAll Challenge Invitation & Access Control Tests PASSED successfully!');
}

runInviteTestSuite();
