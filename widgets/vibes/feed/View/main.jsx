/**
 * Do tastemaker check, see if toast notifcation works, add to nft, add default cid for minting images, add title with day
 * add human check
 */
const path = props.path;
const blockHeight =
  props.blockHeight === "now" ? "now" : parseInt(props.blockHeight);
const subscribe = !!props.subscribe;
const parts = path.split("/");
const accountId = parts[0];
const notifyAccountId = accountId;
const issuer = props.issuer ?? "issuer.proofofvibes.near";
const receiver = props.receiver ?? accountId; // for sbt receiver // default the poster
const showReciever = props.showReciever ?? true;
const showIssuer = props.showIssuer ?? true;
const showReference = props.showReference ?? true;
const showDAO = props.showDAO ?? true;
const showClass = props.showClass ?? true;
const showHeader = props.showHeader ?? true;
const nftDescription =
  props.nftDescription ?? "Proof of Vibe NFT powered by GenaDrop"; // pull from post
const classId = props.classId ?? 1;
const reference =
  props.reference ??
  "https://genadrop.mypinata.cloud/ipfs/QmQ1662QyTESnzWK8gBJdD7BtwQ3ddfXCMy6Hh3FHdmjMk?_gl=1*wrbb39*_ga*MTQ0ODg3NzEzNS4xNjgyNjA0ODQy*_ga_5RMPXG14TE*MTY4OTY4Njc3Ni44LjEuMTY4OTY4NjgyMi4xNC4wLjA";
const accountLoggedIn = context.accountId; // use this just in case
const postUrl = `https://near.org#/near/widget/PostPage?accountId=${accountId}&blockHeight=${blockHeight}`;
const profile = Social.getr(`${accountId}/profile`);
const profileName = accountId;
if (!!profile) {
  profileName = profile.name; // profile name
  console.log("Profile Name: " + profileName);
}
const daoId = props.daoId ?? "vibes.sputnik-dao.near";
const role = props.role ?? "vibee";
const badges = ["og", "vibes", "regen", "human"];
const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1; // Months are zero-based, so we add 1
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
};
const formatDateBlockHeight = (blockHeight) => {
  const block = Near.block(blockHeight);
  console.log("Block: " + block);
  const timeMs = parseFloat(block.header.timestamp_nanosec) / 1e6;
  const date = new Date(timeMs);
  console.log("Date: " + date);
  return date.toDateString();
};

const formattedPostDate = formatDateBlockHeight(blockHeight); // this is showing as error

const formattedDate = formatDate(Date.now());

// const titleWithDate = "Proof of Vibes " + accountId + " " + formattedDate; // add event later
const titleWithDate = "Proof of Vibes " + profileName + " " + formattedPostDate;
// const nftTitle = props.nftTitle ?? titleWithDate; // see about adding title and person that vibes them // also date should be when post was posted

const hasImageInPost = content.image != null; // need to check if image in post
// need to get image url
const content = props.content ?? JSON.parse(Social.get(path, blockHeight));
const image = content.image;
const type = content.type;
console.log("Content type: " + type);
const metadata = content.metadata;
console.log("Content Metadata: " + metadata);
if (content.text) {
  State.update({
    description: content.text,
  });
  console.log("Content Text: " + context.text);
}

const item = {
  type: "social",
  path: path,
  blockHeight,
};
State.init({
  receiver: receiver,
  issuer: issuer,
  reference: reference,
  daoId: daoId,
  classId: classId,
  toastMessage: "",
  showAlert: false,
  description: nftDescription,
  title: nftTitle,
  imageCid: "bafkreiak7jzkpmrv365dskqk4thmlki3ts7kzq44hqr62dmrimbn47676e",
  cid: "bafkreifsrsklegk4r3jft4fucwvo4pzzwczjecsfg5qrjgp2arevnel2ee",
  image,
  content,
});

const isTasteMaker = true;
// const accountId = context.accountId;

const post_args = JSON.stringify({
  receiver: accountId, // accountId is the person who wrote the post
  metadata: {
    class: state.classId,
  },
  reference: state.reference,
});
const proposal_args = Buffer.from(post_args, "utf-8").toString("base64");
//   const gas = 200000000000000;
//   const deposit = 80000000000000000000000; // 0.008 //
const policy = Near.view(daoId, "get_policy");
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
    if (user && role.kind.Group && role.kind.Group.includes(user)) {
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
// this dont work
const canPropose = isUserAllowedTo(
  context.accountId,
  proposalKinds.FunctionCall,
  actions.AddProposal
);
const canProposeMemberAdd = isUserAllowedTo(
  context.accountId,
  proposalKinds.AddMemberToRole,
  actions.AddProposal
);
console.log(
  "Can loggedin user propose to add member to dao: " + canProposeMemberAdd
);
// IAH Verification
const getFirstSBTToken = (issuerContract) => {
  const view = Near.view("registry.i-am-human.near", "sbt_tokens_by_owner", {
    account: accountId,
    issuer: issuerContract,
  });
  return view?.[0]?.[1]?.[0];
};

const isHuman = getFirstSBTToken("fractal.i-am-human.near") !== undefined;
const isVibe = getFirstSBTToken("issuer.proofofvibes.near") !== undefined;

const Post = styled.div`
  position: relative;

  &::before {
    content: "";
    display: block;
    position: absolute;
    left: 19px;
    top: 52px;
    bottom: 12px;
    width: 2px;
    background: #eceef0;
  }
`;

const Header = styled.div`
  margin-bottom: 0;
  display: inline-flex;
`;

const Body = styled.div`
  padding-left: 52px;
  padding-bottom: 1px;
`;

const Content = styled.div`
  img {
    display: block;
    max-width: 100%;
    max-height: 80vh;
    margin: 0 0 12px;
  }
`;

const Text = styled.p`
  display: block;
  margin: 0;
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  color: #687076;
  white-space: nowrap;
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: -6px -6px 6px;
`;

function renderContent() {
  console.log(
    "Content Image: Type: " + typeof content.image + " Image " + content.image
  );

  if (type === "md" || type === "social") {
    return (
      <>
        {content.text && (
          <Widget
            src="near/widget/SocialMarkdown"
            props={{ text: content.text }}
          />
        )}

        {content.image && (
          <Widget
            src="mob.near/widget/Image"
            props={{
              image: content.image,
            }}
          />
        )}
      </>
    );
  }
}

// may need to comment out
// need to check role if tastemaker

const checkMintersJson = Near.view(issuer, "class_minter", { class: classId }); // need to extract all value and check if user is in minters array. // maybe conditional logic for dao
const mintAuthorities = checkMintersJson.minters;
const isMintAuthority = mintAuthorities.includes(context.accountId);
const daoIsMinter = mintAuthorities.includes(daoId);
const proposeVibee = () => {
  const gas = 200000000000000;
  const deposit = 100000000000000000000000;
  Near.call([
    {
      contractName: daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: "Recommended as a vibee",
          kind: {
            AddMemberToRole: {
              member_id: accountId,
              role: role,
            },
          },
        },
      },
      gas: gas,
      deposit: deposit,
    },
  ]);
};
const sbtMint = () => {
  const gas = 200000000000000;
  const deposit = 80000000000000000000000; // 0.008 // maybe change zero
  Near.call([
    {
      contractName: state.issuer,
      methodName: "sbt_mint",
      args: {
        receiver: accountId,
        metadata: {
          class: classId,
        },
        reference: reference,
      },
      gas: gas,
      deposit: deposit,
    },
  ]);
};
const nftMint = () => {
  //   if (!state.image.cid) {
  //     return;
  //   }
  if (!accountId) {
    console.log("Please login"); // add share dogvwallet
    State.update({
      showAlert: true,
      toastMessage: "Please log in before continuing",
    });
    setTimeout(() => {
      State.update({
        showAlert: false,
      });
    }, 3000);
  } else if (!state.title) {
    console.log("Please Enter title");
    State.update({
      showAlert: true,
      toastMessage: "Please enter a title for the NFT",
    });

    setTimeout(() => {
      State.update({
        showAlert: false,
      });
    }, 3000);
  } else if (!state.description) {
    State.update({
      showAlert: true,
      toastMessage: "Please enter a description for the NFT",
    });
    setTimeout(() => {
      State.update({
        showAlert: false,
      });
    }, 3000);
  } else {
    const metadata = {
      name: state.title,
      description: state.description,
      properties: [],
      image: `${state.image.url}`,

      //   image: `ipfs://${state.image.ipfs_cid}`,
      //   image: `ipfs://${state.image.cid}`,
      //   image: `ipfs://${state.imageCid}`,
    };
    console.log("come", metadata);
    asyncFetch("https://ipfs.near.social/add", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: metadata,
    }).then((res) => {
      console.log("GO ON SOUN", res);
      const cid = res.body.cid;
      const gas = 200000000000000;
      const deposit = 10000000000000000000000;
      Near.call([
        {
          contractName: "nft.genadrop.near",
          methodName: "nft_mint",
          args: {
            token_id: `${Date.now()}`,
            metadata: {
              title: state.title,
              description: state.description,
              //   media: `https://ipfs.io/ipfs/${state.imageCid}`,
              // media: `https://ipfs.io/ipfs/${state.image.cid}`,
              media: `${state.content.image}`,

              //   media: `https://ipfs.io/ipfs/${state.image.ipfs_cid}`,
              reference: `ipfs://${cid}`,
              //   reference: `ipfs://${state.cid}`,
            },
            receiver_id: accountId,
          },
          gas: gas,
          deposit: deposit,
        },
      ]);
    });
  }
};

// change this
const sbtDAOMint = () => {
  Near.call([
    {
      contractName: state.daoId,
      methodName: "add_proposal",
      args: {
        proposal: {
          description: "create proposal to mint SBT",
          kind: {
            FunctionCall: {
              receiver_id: state.issuer,
              actions: [
                {
                  method_name: "sbt_mint",
                  args: proposal_args,
                  deposit: "80000000000000000000000",
                  gas: "200000000000000",
                },
              ],
            },
          },
        },
      },
      deposit: deposit,
      gas: "219000000000000",
    },
  ]);
};

return (
  <div className="border-bottom pt-3 pb-1">
    <div>
      <div className="d-flex flex-row align-items-center">
        <div className="flex-grow-1 text-truncate">
          <a
            className="text-dark text-decoration-none text-truncate"
            href={`#/mob.near/widget/ProfilePage?accountId=${accountId}`}
          >
            <Widget
              src="mob.near/widget/Profile.ShortInlineBlock"
              props={{ accountId, tooltip: true }}
            />
          </a>
        </div>

        <span className="text-nowrap text-muted">
          {badges.map((badge) => (
            <Widget
              src="proofofvibes.near/widget/sbtEmojiHelper"
              props={{ accountId: accountId, badgeType: badge }}
            />
          ))}
          <small>
            {blockHeight === "now" ? (
              "now"
            ) : (
              <a className="text-muted" href={link}>
                <Widget src="mob.near/widget/TimeAgo" props={{ blockHeight }} />
              </a>
            )}
          </small>
          {true && blockHeight !== "now" && (
            <div>
              <span>
                <a
                  href="javascript:void"
                  className="link-secondary ms-2"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="fs-6 bi bi-three-dots" />
                </a>
                <ul className="dropdown-menu col">
                  {hasImageInPost && (
                    <li className="dropdown-item row">
                      <a
                        className="link-dark text-decoration-none"
                        onClick={nftMint}
                      >
                        <i className="bi bi-emoji-gift" /> Mint to User As NFT
                      </a>
                    </li>
                  )}
                  {isMintAuthority && isHuman && !isVibe && (
                    <li className="dropdown-item row">
                      <a
                        className="link-dark text-decoration-none"
                        onClick={sbtMint}
                      >
                        <i className="bi bi-shield" /> Issue SBT
                      </a>
                    </li>
                  )}

                  {canPropose && (
                    <li className="dropdown-item row">
                      <a
                        className="link-dark text-decoration-none"
                        onClick={proposeVibee}
                      >
                        <i className="bi bi-emoji-sunglasses" /> Recommend as
                        Vibee
                      </a>
                    </li>
                  )}

                  {canPropose && daoIsMinter && isHuman && !isVibe && (
                    <li className="dropdown-item row">
                      <a
                        className="link-dark text-decoration-none"
                        onClick={sbtDAOMint}
                      >
                        <i className="bi bi-shield-lock" /> Propose to Mint
                        Proof of Vibe SBT
                      </a>
                    </li>
                  )}
                </ul>
              </span>
            </div>
          )}
        </span>
      </div>
    </div>
    <div className="mt-3 text-break">
      <Widget
        src="mob.near/widget/MainPage.Post.Content"
        props={{ content, raw }}
      />
    </div>
    {blockHeight !== "now" && (
      <div className="mt-1 d-flex justify-content-between">
        <div className="me-4">
          <Widget
            src="mob.near/widget/CommentButton"
            props={{
              onClick: () =>
                !state.showReply && State.update({ showReply: true }),
            }}
          />
        </div>
        <div className="me-4">
          <Widget
            src="mob.near/widget/LikeButton"
            props={{
              notifyAccountId,
              item,
            }}
          />
        </div>
        <div>
          <Widget
            src="mob.near/widget/MainPage.Post.ShareButton"
            props={{ accountId, blockHeight, postType: "post" }}
          />
        </div>
      </div>
    )}
    <div className="mt-3 ps-5">
      {state.showReply && (
        <div className="mb-2">
          <Widget
            src="mob.near/widget/MainPage.Comment.Compose"
            props={{
              notifyAccountId,
              item,
              onComment: () => State.update({ showReply: false }),
            }}
          />
        </div>
      )}
      <Widget
        src="mob.near/widget/MainPage.Comment.Feed"
        props={{
          item,
          highlightComment: props.highlightComment,
          limit: props.commentsLimit,
          subscribe,
          raw,
        }}
      />
    </div>
    {state.showAlert && (
      <Widget src="jgodwill.near/widget/genalert" props={state} />
    )}
  </div>
);
