/** To-DO
 * - add slider logic, add automatic tagging for proof of vibes.near
 * - map sliders amount into emojis w markdown friednliness ❤️ diversity 🌈 desntiy 🧊 energy ⚡️
 * requrie image to post, put genealert
 * add mint button
 * detect change and if no change on sliders dont let post, show genalert
 * add tool tips
 */
const location = props.location; // just adding this
const embedHashtags = props.embedHashtags || [];
const embedMentions = props.embedMentions || [];
const showSliders = props.showSliders ?? true;
if (!context.accountId) return <></>;
const maxSliderPoints = 10;
State.init({
  image: {},
  text: `${embedHashtags.map((it) => `#${it} `).join("")} ${embedMentions.map(
    (it) => `@${it}`
  )} @proofofvibes.near`,
  showPreview: false,
  friendliness: 5,
  energy: 5,
  density: 5,
  diversity: 5,
  location,
});

const handleSliderFriendliness = (event) => {
  const value = event.target.value;
  State.update({ friendliness: value });
  console.log("New Friendliness Score: " + state.friendliness);
};
const handleSliderEnergy = (event) => {
  const value = event.target.value;
  const newText = state.text; // adds to many needs better indicator of this
  State.update({ energy: value, text: newText });
  console.log("New Energy Score: " + state.energy);
};
const handleSliderDensity = (event) => {
  const value = event.target.value;
  State.update({ density: value });
  console.log("New Density Score: " + state.density);
};
const handleSliderDiversity = (event) => {
  const value = event.target.value;
  State.update({ diversity: value });
  console.log("New Diversity Score: " + state.diversity);
};
const profile = Social.getr(`${context.accountId}/profile`);
const autocompleteEnabled = true;

const content = {
  type: "md",
  image: state.image.cid ? { ipfs_cid: state.image.cid } : undefined,
  text: state.text,
  metadata: {
    tastemaker: embedMentions,
  },
};
// add sliders

function extractMentions(text) {
  const mentionRegex =
    /@((?:(?:[a-z\d]+[-_])*[a-z\d]+\.)*(?:[a-z\d]+[-_])*[a-z\d]+)/gi;
  return Array.from(text.matchAll(mentionRegex), (match) =>
    match[1].toLowerCase()
  );
}

function extractTagNotifications(text, item) {
  return extractMentions(text || "")
    .filter((accountId) => accountId !== context.accountId)
    .map((accountId) => ({
      key: accountId,
      value: {
        type: "mention",
        item,
      },
    }));
}

const extractHashtags = (text) => {
  const hashtagRegex = /#(\w+)/gi;
  return Array.from(text.matchAll(hashtagRegex), (match) =>
    match[1].toLowerCase()
  );
};
function checkImage() {
  if (content.image === undefined) {
    <Widget
      src="jgodwill.near/widget/genalert"
      props={{ toastMessage: "you must upload an image to do a vibe check" }}
    />;
  }
}
checkImage();

function composeData() {
  content.text =
    content.text +
    " Friendliness: " +
    state.friendliness +
    "/" +
    maxSliderPoints +
    " Energy: " +
    state.energy +
    "/" +
    maxSliderPoints +
    " Density: " +
    state.density +
    "/" +
    maxSliderPoints +
    " Diversity: " +
    state.diversity +
    "/" +
    maxSliderPoints;
  const data = {
    post: {
      main: JSON.stringify(content),
      rating:
        parseInt(state.friendliness) +
        parseInt(state.energy) +
        parseInt(state.density) +
        parseInt(state.diversity),
      friendliness: state.friendliness,
      energy: state.energy,
      density: state.density,
      diversity: state.diversity,
      location: state.location,
    },
    index: {
      post: JSON.stringify({
        key: "main",
        value: {
          type: "md",
        },
      }),
    },
  };

  const hashtags = extractHashtags(content.text);
  hashtags = hashtags.concat(embedHashtags);

  const item = {
    type: "social",
    path: `${context.accountId}/post/main`,
  };
  if (hashtags.length) {
    data.index.hashtag = JSON.stringify(
      hashtags.map((hashtag) => ({
        key: hashtag,
        value: item,
      }))
    );
  }

  const notifications = extractTagNotifications(state.text, item);

  if (embedMentions.length) {
    const mentions = embedMentions.map((accountId) => ({
      key: accountId,
      value: {
        type: "mention",
        item,
      },
    }));
    notifications = notifications.concat(mentions);
  }
  if (notifications.length) {
    data.index.notify = JSON.stringify(
      notifications.length > 1 ? notifications : notifications[0]
    );
  }

  return data;
}

function onCommit() {
  State.update({
    image: {},
    text: "",
  });
}

function textareaInputHandler(value) {
  const showAccountAutocomplete = /@[\w][^\s]*$/.test(value);
  State.update({ text: value, showAccountAutocomplete });
}

function autoCompleteAccountId(id) {
  let text = state.text.replace(/[\s]{0,1}@[^\s]*$/, "");
  text = `${text} @${id}`.trim() + " ";
  State.update({ text, showAccountAutocomplete: false });
}

const Wrapper = styled.div`
  --padding: 24px;
  position: relative;

  @media (max-width: 1200px) {
    --padding: 12px;
  }

`;
const Card = styled.div`
padding: 1em;
border: 1px solid #e5e8eb;
gap: 2em;
margin: 10px auto;
border-radius: .7em;
`;

const SliderWrapper = styled.div`

  .slider-container {
  width: 100%;
  margin: 1em;
  text-align: center;
}

.slider {
  width: 100%;
  height: 1em;
  background: #ddd;
  border-radius: 5px;
  cursor: pointer;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
}

.slider-value {
  display: block;
  margin-top: 10px;
}
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  pointer-events: none;
  position: absolute;
  top: var(--padding);
  left: var(--padding);

  img {
    object-fit: cover;
    border-radius: 40px;
    width: 100%;
    height: 100%;
  }

  @media (max-width: 992px) {
    display: none;
  }
`;

const Textarea = styled.div`
  display: grid;
  vertical-align: top;
  align-items: center;
  position: relative;
  align-items: stretch;

  &::after,
  textarea {
    width: 100%;
    min-width: 1em;
    height: unset;
    min-height: 164px;
    font: inherit;
    padding: var(--padding) var(--padding) calc(40px + (var(--padding) * 2))
      calc(40px + (var(--padding) * 2));
    margin: 0;
    resize: none;
    background: none;
    appearance: none;
    border: none;
    grid-area: 1 / 1;
    overflow: hidden;
    outline: none;

    @media (max-width: 1200px) {
      min-height: 124px;
    }

    @media (max-width: 992px) {
      padding-left: var(--padding);
    }
  }

  &::after {
    content: attr(data-value) " ";
    visibility: hidden;
    white-space: pre-wrap;
  }

  textarea {
    transition: all 200ms;

    &::placeholder {
      opacity: 1;
      color: #687076;
    }

    &:empty + p {
      display: block;
    }

    &:focus {
      box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.05);
    }
  }
`;

const TextareaDescription = styled.p`
  position: absolute;
  top: calc(var(--padding) + 24px);
  left: calc(42px + (var(--padding) * 2));
  right: var(--padding);
  font-size: 10px;
  line-height: 18px;
  font-weight: 400;
  color: #687076;
  pointer-events: none;
  display: none;

  a {
    color: #000;
    outline: none;
    font-weight: 600;
    pointer-events: auto;

    &:hover,
    &:focus {
      color: #000;
      text-decoration: underline;
    }
  }

  @media (max-width: 992px) {
    left: var(--padding);
  }
`;

const Actions = styled.div`
  display: inline-flex;
  gap: 12px;
  position: absolute;
  bottom: var(--padding);
  right: var(--padding);

  .commit-post-button,
  .preview-post-button {
    background: #59e692;
    color: #09342e;
    border-radius: 40px;
    height: 40px;
    padding: 0 35px;
    font-weight: 600;
    font-size: 14px;
    border: none;
    cursor: pointer;
    transition: background 200ms, opacity 200ms;

    &:hover,
    &:focus {
      background: rgb(112 242 164);
      outline: none;
    }

    &:disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  .preview-post-button {
    color: #11181c;
    background: #f1f3f5;
    padding: 0;
    width: 40px;

    &:hover,
    &:focus {
      background: #d7dbde;
      outline: none;
    }
  }

  .upload-image-button {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f3f5;
    color: #11181c;
    border-radius: 40px;
    height: 40px;
    min-width: 40px;
    font-size: 0;
    border: none;
    cursor: pointer;
    transition: background 200ms, opacity 200ms;

    &::before {
      font-size: 16px;
    }

    &:hover,
    &:focus {
      background: #d7dbde;
      outline: none;
    }

    &:disabled {
      opacity: 0.5;
      pointer-events: none;
    }

    span {
      margin-left: 12px;
    }
  }

  .d-inline-block {
    display: flex !important;
    gap: 12px;
    margin: 0 !important;

    .overflow-hidden {
      width: 40px !important;
      height: 40px !important;
    }
  }
`;

const Domain = styled.div`
  display: inline-flex;
  gap: 12px;
  position: absolute;
  bottom: var(--padding);
  left: var(--padding);
`;

const PreviewWrapper = styled.div`
  position: relative;
  padding: var(--padding);
  padding-bottom: calc(40px + (var(--padding) * 2));
`;

const AutoComplete = styled.div`
  position: absolute;
  z-index: 5;
  bottom: 0;
  left: 0;
  right: 0;

  > div > div {
    padding: calc(var(--padding) / 2);
  }
`;

return (
  <>
    <Card>
      <Wrapper>
        {state.showPreview ? (
          <PreviewWrapper>
            <Widget
              src="near/widget/Posts.Post"
              props={{
                accountId: context.accountId,
                blockHeight: "now",
                content,
              }}
            />
          </PreviewWrapper>
        ) : (
          <>
            <Avatar>
              <Widget
                src="mob.near/widget/Image"
                props={{
                  image: profile.image,
                  alt: profile.name,
                  fallbackUrl:
                    "https://ipfs.near.social/ipfs/bafkreibmiy4ozblcgv3fm3gc6q62s55em33vconbavfd2ekkuliznaq3zm",
                }}
              />
            </Avatar>
            <Textarea data-value={state.text}>
              <textarea
                placeholder="Vibe check!"
                onInput={(event) => textareaInputHandler(event.target.value)}
                onKeyUp={(event) => {
                  if (event.key === "Escape") {
                    State.update({ showAccountAutocomplete: false });
                  }
                }}
                value={state.text}
              />
            </Textarea>
          </>
        )}
        {autocompleteEnabled && state.showAccountAutocomplete && (
          <AutoComplete>
            <Widget
              src="near/widget/AccountAutocomplete"
              props={{
                term: state.text.split("@").pop(),
                onSelect: autoCompleteAccountId,
                onClose: () => State.update({ showAccountAutocomplete: false }),
              }}
            />
          </AutoComplete>
        )}

        <Actions>
          {!state.showPreview && (
            <IpfsImageUpload
              image={state.image}
              className="upload-image-button bi bi-image"
            />
          )}
          <button
            type="button"
            disabled={!state.text}
            className="preview-post-button"
            title={state.showPreview ? "Edit Post" : "Preview Post"}
            onClick={() => State.update({ showPreview: !state.showPreview })}
          >
            {state.showPreview ? (
              <i className="bi bi-pencil" />
            ) : (
              <i className="bi bi-eye-fill" />
            )}
          </button>

          <CommitButton
            disabled={!state.text}
            force
            data={composeData}
            onCommit={onCommit}
            className="commit-post-button"
          >
            Vibe Check
          </CommitButton>
        </Actions>
      </Wrapper>
      <SliderWrapper>
        {showSliders && (
          <div>
            <label className="slider-label" for="friendlySlider">
              ❤️ Friendliness :{" "}
            </label>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                id="friendlySlider"
                max={maxSliderPoints}
                value={state.friendliness}
                onChange={handleSliderFriendliness}
                className="slider"
              />
              <span className="slider-value">{sliderValue}</span>
            </div>
            <label className="slider-label" for="energySlider">
              ⚡️ Energy :{" "}
            </label>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                id="energySlider"
                max={maxSliderPoints}
                value={state.energy}
                onChange={handleSliderEnergy}
                className="slider"
              />
              <span className="slider-value">{sliderValue}</span>
            </div>
            <label className="slider-label" for="densitySlider">
              🧊 Density :{" "}
            </label>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                id="densitySlider"
                max={maxSliderPoints}
                value={state.density}
                onChange={handleSliderDensity}
                className="slider"
              />
              <span className="slider-value">{sliderValue}</span>
            </div>
            <label className="slider-label" for="diversitySlider">
              🌈 Diversity :{" "}
            </label>
            <div className="slider-container">
              <input
                type="range"
                min="0"
                id="diversitySlider"
                max={maxSliderPoints}
                value={state.diversity}
                onChange={handleSliderDiversity}
                className="slider"
              />
              <span className="slider-value">{sliderValue}</span>
            </div>
          </div>
        )}
      </SliderWrapper>
    </Card>
  </>
);
