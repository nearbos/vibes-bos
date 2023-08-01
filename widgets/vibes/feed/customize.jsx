const location = "#Paris";
const tastemaker = "@ogruss.near";
const vibeTag = "#ProofOfVibes";
return (
  <Widget
    src="proofofvibes.near/widget/vibes.feed.main"
    props={{
      data: {
        hashtagWhitelist: vibeTag,
        location,
        typeWhitelist: ["md"],
        embedMentions: [tastemaker, "@ndcplug.near"],
        // postTemplate: "efiz.near/widget/placeholder",
      },
    }}
  />
);
