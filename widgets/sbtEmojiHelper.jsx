const accountId = props.accountId ?? "ogruss.near";
const badgeType = props.badgeType ?? "vibes";
let hasToken = false;

const badgeEmoji =
  badgeType === "vibes"
    ? "😊"
    : badgeType === "regen"
    ? "🌸"
    : badgeType === "og"
    ? "💯"
    : badgeType === "human"
    ? "✅"
    : "";
const issuer =
  badgeType === "vibes"
    ? "issuer.proofofvibes.near"
    : badgeType === "regen"
    ? "issuer.regens.near"
    : badgeType === "og"
    ? "community.i-am-human.near"
    : badgeType === "human"
    ? "fractal.i-am-human.near"
    : "";
const Icon = styled.div`
  width: 24px;
  height: 24px;
  background-image: url('https://i-am-human.app/static/media/ndc.31fdbbd1a8932f5986cf.png');
  background-size: cover;
`;

if (accountId) {
  const getFirstSBTToken = () => {
    const view = Near.view("registry.i-am-human.near", "sbt_tokens_by_owner", {
      account: `${accountId}`,
      issuer: issuer,
    });
    return view?.[0]?.[1]?.[0];
  };
  hasToken = getFirstSBTToken() !== undefined;
}

if (hasToken) {
  return <span>{badgeEmoji}</span>;
} else {
  return <></>;
}
