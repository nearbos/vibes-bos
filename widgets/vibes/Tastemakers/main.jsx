// check role in DAO
const daoId = "vibes.sputnik-dao.near"; // add tastemaker logic here
const isTasteMaker = true;
const accountId = context.accountId;

const sharedButtonStyles = `
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  height: 32px;
  border-radius: 50px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  text-align: center;
  cursor: pointer;

  &:hover,
  &:focus {
    text-decoration: none;
    outline: none;
  }

  i {
    color: #7E868C;
  }

  .bi-16 {
    font-size: 16px;
  }
`;

const Button = styled.button`
  ${sharedButtonStyles}
  color: ${(p) => (p.primary ? "#09342E" : "#11181C")} !important;
  background: ${(p) => (p.primary ? "#59E692" : "#FBFCFD")};
  border: ${(p) => (p.primary ? "none" : "1px solid #D7DBDF")};

  &:hover,
  &:focus {
    background: ${(p) => (p.primary ? "rgb(112 242 164)" : "#ECEDEE")};
  }
`;

const ButtonLink = styled.a`
  ${sharedButtonStyles}
  color: ${(p) => (p.primary ? "#09342E" : "#11181C")} !important;
  background: ${(p) => (p.primary ? "#59E692" : "#FBFCFD")};
  border: ${(p) => (p.primary ? "none" : "1px solid #D7DBDF")};

  &:hover,
  &:focus {
    background: ${(p) => (p.primary ? "rgb(112 242 164)" : "#ECEDEE")};
  }
`;
if (!accountId) {
  return (
    <div>
      <p>Login to NEAR with your 🥂 tastemaker approved wallet</p>
      <ButtonLink href="https://ProofOfVibes.com/wallet" target="_blank">
        <i className="bi bi-wallet"></i> Get A NEAR Wallet
      </ButtonLink>
      <p>Apply to be a tastemaker here</p>
      <ButtonLink href="https://ProofOfVibes.com/apply" target="_blank">
        <i className="bi bi-pencil-fill"></i> Apply to Be A Tastemaker
      </ButtonLink>
    </div>
  );
}

// const accountId = props.accountId ?? context.accountId;

const proposalKinds = {
  ChangeConfig: "config",
  ChangePolicy: "policy",
  AddMemberToRole: "add_member_to_role",
  RemoveMemberFromRole: "remove_member_from_role",
  FunctionCall: "call",
  UpgradeSelf: "upgrade_self",
  UpgradeRemote: "upgrade_remote",
  Transfer: "transfer",
  SetStakingContract: "set_vote_token",
  AddBounty: "add_bounty",
  BountyDone: "bounty_done",
  Vote: "vote",
  FactoryInfoUpdate: "factory_info_update",
  ChangePolicyAddOrUpdateRole: "policy_add_or_update_role",
  ChangePolicyRemoveRole: "policy_remove_role",
  ChangePolicyUpdateDefaultVotePolicy: "policy_update_default_vote_policy",
  ChangePolicyUpdateParameters: "policy_update_parameters",
};

const actions = {
  AddProposal: "AddProposal",
  VoteApprove: "VoteApprove",
  VoteReject: "VoteReject",
  VoteRemove: "VoteRemove",
};

// -- Get all the roles from the DAO policy
let roles = Near.view(daoId, "get_policy");
roles = roles === null ? [] : roles.roles;

const isUserAllowedTo = (user, kind, action) => {
  // -- Filter the user roles
  const userRoles = [];
  for (const role of roles) {
    if (role.kind === "Everyone") {
      userRoles.push(role);
      continue;
    }
    if (!role.kind.Group) continue;
    if (accountId && role.kind.Group && role.kind.Group.includes(accountId)) {
      userRoles.push(role);
    }
  }

  // -- Check if the user is allowed to perform the action
  let allowed = false;

  userRoles
    .filter(({ permissions }) => {
      const allowedRole =
        permissions.includes(`${kind.toString()}:${action.toString()}`) ||
        permissions.includes(`${kind.toString()}:*`) ||
        permissions.includes(`*:${action.toString()}`) ||
        permissions.includes("*:*");
      allowed = allowed || allowedRole;
      return allowedRole;
    })
    .map((role) => role.name);

  return allowed;
};

console.log(
  "Is User Allowed To 'Add a Proposal' of type 'FunctionCall'?",
  isUserAllowedTo(accountId, proposalKinds.FunctionCall, actions.AddProposal)
);

console.log(
  "Is User Allowed To 'Vote Yes' on a proposal of type 'FunctionCall'?",
  isUserAllowedTo(accountId, proposalKinds.FunctionCall, actions.VoteApprove)
);

console.log(
  "Is User Allowed To 'Add a Proposal' of type 'AddMemberToRole'?",
  isUserAllowedTo(accountId, proposalKinds.AddMemberToRole, actions.AddProposal)
);
const canPropose = isUserAllowedTo(
  accountId,
  proposalKinds.FunctionCall,
  actions.AddProposal
);

return (
  <div>
    {isTasteMaker && (
      <Widget src="proofofvibes.near/widget/Vibes.Tastemakers.tapIn" />
    )}
  </div>
);
