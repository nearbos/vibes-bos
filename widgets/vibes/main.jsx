State.init({
  selectedTab: props.tab || "social",
});
const socialAccountId = props.socialAccountId ?? "proofofvibes.near";
const socialProfile = Social.getr(`${socialAccountId}/profile`);
const role = props.role ?? "vibee";
const accountId = props.accountId ?? context.accountId;
const daoId = props.daoId ?? "vibes.sputnik-dao.near";
const reference =
  props.reference ??
  "https://genadrop.mypinata.cloud/ipfs/QmQ1662QyTESnzWK8gBJdD7BtwQ3ddfXCMy6Hh3FHdmjMk?_gl=1*wrbb39*_ga*MTQ0ODg3NzEzNS4xNjgyNjA0ODQy*_ga_5RMPXG14TE*MTY4OTY4Njc3Ni44LjEuMTY4OTY4NjgyMi4xNC4wLjA";

const page = accountId
  ? Social.get(`${accountId}/settings/dao/page`)
  : undefined;

if (page === null) {
  return "Loading...";
}

const feed = accountId
  ? Social.get(`${accountId}/settings/dao/feed`)
  : undefined;

if (feed === null) {
  return "Loading...";
}

if (props.tab && props.tab !== state.selectedTab) {
  State.update({
    selectedTab: props.tab,
  });
}

const daoPageAccount = "proofofvibes.near";
const profile = props.profile ?? Social.getr(`${daoId}/profile`);
const accountUrl = `#/${daoPageAccount}/widget/Vibes.main?daoId=${daoId}`;

const Wrapper = styled.div`
  padding-bottom: 48px;
`;

const Main = styled.div`
  display: grid;
  gap: 40px;
  grid-template-columns: 352px minmax(0, 1fr);
  align-items: start;

  @media (max-width: 1200px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const BackgroundImage = styled.div`
  height: 240px;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  margin: 0 -12px;
  background: #eceef0;

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 1200px) {
    margin: calc(var(--body-top-padding) * -1) -12px 0;
    border-radius: 0;
  }

  @media (max-width: 900px) {
    height: 100px;
  }
`;

const SidebarWrapper = styled.div`
  position: relative;
  z-index: 5;
  margin-top: -55px;

  @media (max-width: 900px) {
    margin-top: -40px;
  }
`;

const Content = styled.div`
  .post {
    padding-left: 0;
    padding-right: 0;
  }
`;

const Title = styled.h1`
  font-weight: 600;
  font-size: ${(p) => p.size || "25px"};
  line-height: 1.2em;
  color: #11181c;
  margin: ${(p) => (p.margin ? "0 0 24px" : "0")};
  overflow-wrap: anywhere;
`;

const Tabs = styled.div`
  display: flex;
  height: 48px;
  border-bottom: 1px solid #eceef0;
  margin-bottom: 28px;
  overflow: auto;
  scroll-behavior: smooth;

  @media (max-width: 1200px) {
    background: #f8f9fa;
    border-top: 1px solid #eceef0;
    margin: 0 -12px 26px;

    > * {
      flex: 1;
    }
  }
`;

const TabsButton = styled.a`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-weight: 600;
  font-size: 12px;
  padding: 0 12px;
  position: relative;
  color: ${(p) => (p.selected ? "#11181C" : "#687076")};
  background: none;
  border: none;
  outline: none;
  text-align: center;
  text-decoration: none !important;

  &:hover {
    color: #11181c;
  }

  &::after {
    content: "";
    display: ${(p) => (p.selected ? "block" : "none")};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: #59e692;
  }
`;

const Bio = styled.div`
  color: #11181c;
  font-size: 14px;
  line-height: 20px;
  margin-bottom: 48px;

  > *:last-child {
    margin-bottom: 0 !important;
  }

  @media (max-width: 900px) {
    margin-bottom: 48px;
  }
`;

if (profile === null) {
  return "Loading...";
}

return (
  <Wrapper>
    <BackgroundImage>
      {profile.backgroundImage && (
        <Widget
          src="mob.near/widget/Image"
          props={{
            image: profile.backgroundImage,
            alt: "profile background image",
            fallbackUrl:
              "https://ipfs.near.social/ipfs/bafkreidcmajif3wgkl5f5u66d6bzjinxlticp7vqufzsc7eaz5ytat72pi",
          }}
        />
      )}
    </BackgroundImage>

    <Main>
      <SidebarWrapper>
        <Widget
          src="ndcplug.near/widget/DAO.main.sidebar"
          props={{
            daoId,
            profile,
            role: role,
          }}
        />
      </SidebarWrapper>

      <Content>
        <Tabs>
          <TabsButton
            href={`${accountUrl}&tab=proposals`}
            selected={state.selectedTab === "proposals"}
          >
            Proposals
          </TabsButton>

          <TabsButton
            href={`${accountUrl}&tab=data`}
            selected={state.selectedTab === "data"}
          >
            Data
          </TabsButton>

          <TabsButton
            href={`${accountUrl}&tab=members`}
            selected={state.selectedTab === "members"}
          >
            Members
          </TabsButton>
          <TabsButton
            href={`${accountUrl}&tab=overview`}
            selected={state.selectedTab === "overview"}
          >
            Social
          </TabsButton>
          <TabsButton
            href={`${accountUrl}&tab=sbt`}
            selected={state.selectedTab === "sbt"}
          >
            Vibe SBT Holders
          </TabsButton>

          <TabsButton
            href={`${accountUrl}&tab=followers`}
            selected={state.selectedTab === "followers"}
          >
            Followers
          </TabsButton>
          <TabsButton
            href={`${accountUrl}&tab=jobs`}
            selected={state.selectedTab === "jobs"}
          >
            Jobs{" "}
          </TabsButton>
          <TabsButton
            href={`${accountUrl}&tab=tastemaker`}
            selected={state.selectedTab === "tastemaker"}
          >
            Tastemakers
          </TabsButton>
          <TabsButton
            href={`${accountUrl}&tab=vibes`}
            selected={state.selectedTab === "vibes"}
          >
            VibeChecks{" "}
          </TabsButton>
        </Tabs>

        {state.selectedTab === "proposals" && (
          <Widget src="sking.near/widget/DAO.Proposals" props={{ daoId }} />
        )}

        {state.selectedTab === "data" && (
          <Widget src="hack.near/widget/DAO.Tabs" props={{ daoId }} />
        )}

        {state.selectedTab === "proposal" && (
          <Widget
            src="sking.near/widget/DAO.Proposal"
            props={{ daoId, ...props }}
          />
        )}
        {state.selectedTab === "sbt" && (
          <>
            <Widget
              src="ndcplug.near/widget/ndc-badge-holders"
              props={{
                title: "NDC Proof of Vibes",
                issuer: "issuer.proofofvibes.near",
                showProgress: false,
                showDropdown: false,
                showHeader: false,
              }}
            />
          </>
        )}
        {state.selectedTab === "jobs" && (
          <>
            <Widget
              src="nearefi.near/widget/ReFi.Requests"
              props={{
                accountId: socialAccountId,
                showSidebar: false,
                showHeader: false,
              }}
            />
          </>
        )}
        {state.selectedTab === "feed" && (
          <Widget
            src="sking.near/widget/DAO.Proposal"
            props={{ daoId, ...props }}
          />
        )}
        {state.selectedTab === "overview" && (
          <>
            {socialProfile.description && (
              <>
                <Title as="h2" size="19px" margin>
                  About
                </Title>

                <Bio>
                  <Widget
                    src="near/widget/SocialMarkdown"
                    props={{ text: socialProfile.description }}
                  />
                </Bio>
              </>
            )}

            <Widget
              src="near/widget/Posts.Feed"
              props={{ accounts: [socialAccountId] }}
            />
          </>
        )}

        {state.selectedTab === "members" && (
          <Widget
            src="nearefi.near/widget/ReFi.DAO.members"
            props={{
              daoId: daoId,
              issuer: issuer,
              classId: 1,
              reference: reference,
            }}
          />
        )}

        {state.selectedTab === "tastemakers" && (
          <Widget
            src="nearefi.near/widget/ReFi.DAO.members"
            props={{
              daoId: daoId,
              issuer: issuer,
              classId: 1,
              reference: reference,
            }}
          />
        )}

        {state.selectedTab === "followers" && (
          <Widget
            src="near/widget/FollowersList"
            props={{ accountId: daoId }}
          />
        )}

        {state.selectedTab === "bounties" && (
          <Widget src="sking.near/widget/DAO.Bounties" props={{ daoId }} />
        )}

        {state.selectedTab === "bounty" && (
          <Widget
            src="sking.near/widget/DAO.Bounty"
            props={{ daoId, ...props }}
          />
        )}
      </Content>
    </Main>
  </Wrapper>
);
