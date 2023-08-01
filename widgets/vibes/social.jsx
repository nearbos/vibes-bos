const hashtags = [
  { name: "ProofOfVibes", required: false },
  { name: "VibeCheck", required: true },
  { name: "Paris", required: false },
];

return (
  <Widget
    src="efiz.near/widget/Community.Posts"
    props={{
      communityHashtags: hashtags,
      exclusive: false,
      allowPublicPosting: true,
    }}
  />
);
