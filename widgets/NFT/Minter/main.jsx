let accountId = context.accountId;
/**
 * add better default cid, add receiver validation for near address
 */
// if (!accountId) {
//   return "Please sign in with NEAR wallet";
// }
let cid =
  props.cid ?? "bafkreibmc23xhip63mxv2mulb7xko5htpiqszrch4fo3optszuctjtlrau";
let image = props.image;
const mintButton = props.mintButton ?? "Mint";
const showDetails = props.showDetails ?? true;
const title = props.title ?? "Example title";
const receiver = props.receiver ?? "ogruss.near";

if (image) {
  cid = image.cid;
  console.log("Image CID: " + cid);
}

let description = props.description ?? "Proof of Vibes powered by GenaDrop";
const profile = socialGetr(`${accountId}/profile`);

if (profile === null) {
  IpfsImageUpload();
  return "Loading";
}
State.init({
  cid: cid,
  description: description,
  title: title,
  image: image,
  receiver: receiver,
  //   image: "",
});

const handleMint = () => {
  if (!state.image.cid) {
    return;
  }
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
      image: `ipfs://${state.image.cid}`,
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
      console.log("State Image CID: " + state.image.cid);
      console.log("Reference CID: " + cid);
      Near.call([
        {
          contractName: "nft.genadrop.near",
          methodName: "nft_mint",
          args: {
            token_id: `${Date.now()}`,
            metadata: {
              title: state.title,
              description: state.description,
              media: `https://ipfs.io/ipfs/${state.image.cid}`,
              reference: `ipfs://${cid}`,
            },
            receiver_id: state.receiver,
          },
          gas: gas,
          deposit: deposit,
        },
      ]);
    });
  }
};

initState({
  title: "",
  description: "",
  showAlert: false,
  toastMessage: "",
});

const onChangeTitle = (title) => {
  State.update({
    title,
  });
};
const onChangeReceiver = (receiver) => {
  State.update({
    receiver,
  });
};

const onChangeDesc = (description) => {
  State.update({
    description,
  });
};

if (!accountId) {
  console.log("Please login");
  State.update({
    showAlert: true,
    toastMessage: "Please log in before continuing",
  });
}

const ImageUploadCard = styled.div`
display:flex;
flex-flow: column nowrap;
align-items: center;
  width:80%;
  border: 2px dashed #0d99ff;
  border-radius: 1rem;
  box-shadow: 4px 4px 20px 6px rgba(0,0,0,.2);
  margin:30px auto;
  padding:1.5rem;
  text-align: center;
`;
const Main = styled.div`
position:relative;
  font-family: "SF Pro Display",sans-serif;
`;

const Heading = styled.p`
  margin: 10px auto 10px auto;
  font-size: 1em;
  color:#0f1d40;
  width:60%;
  text-align: center;
  font-family: "SF Pro Display",sans-serif;
`;

const Toast = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  align-conten: center;
  bottom: 60px;
  right: 20px;
  background-color: red;
  color: #fff;
  padding: 16px;
  border-radius: 8px;
  z-index: 100;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  line-height:1;
`;

const Elipse = styled.div`
background-color:#eff3f9;
height: 100px;
width: 100px;
border-radius: 50%;
`;

const Text = styled.p`
font-size: .9rem;
color: #525c76;
line-height:1.rem;
margin: 3px;
`;

const Card = styled.div`
padding: 1em;
border: 1px solid #e5e8eb;
gap: 2em;
margin: 10px auto;
border-radius: .7em;
`;

const ImageCard = styled.div`
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
  height:fit-content;
  max-height:500px;
  width: 90%;
  max-width: 500px;
  border-radius: 1rem;
  &>img{
  object-fit: contain;
  }
`;

const Input = styled.input`
  display: block;
  padding:.5em;
  width:100%;
  border: 1px solid #e5e8eb;
  border-radius: 10px;
  outline: none;
  background: #f4f5f6;
  color: #525c76;
  :focus{
    border:1px solid #0d99ff;
  }
  ::placeholder {
    color: palevioletred;
  }
`;

const TextArea = styled.textarea`
  display: block;
  padding:.5em;
  width:100%;
  border: 1px solid #e5e8eb;
  border-radius: 10px;
  outline: none;
  background: #f4f5f6;
  color: #525c76;
  :focus{
    border:1px solid #0d99ff;
  }
`;
// state.image.cid
return (
  <Main className="container-fluid">
    <div>
      <Card className="d-flex flex-column align-items-center">
        {!!state.image.cid ?? (
          <ImageCard>
            <img
              src={`https://ipfs.io/ipfs/` + state.image.cid}
              alt="uploaded image"
              width="100%"
              height="100%"
              className="rounded-3"
            />
          </ImageCard>
        )}
        <div>
          <IpfsImageUpload
            image={state.image}
            className="btn btn-outline-primary border-0 rounded-3"
          />
        </div>
      </Card>
      {showDetails && (
        <Card>
          <h5>NFT Details</h5>
          <Card>
            Title:
            <Input
              type="text"
              onChange={(e) => onChangeTitle(e.target.value)}
              placeholder={state.title}
            />
          </Card>
          <Card>
            Description:
            <TextArea
              type="text"
              onChange={(e) => onChangeDesc(e.target.value)}
              placeholder={state.description}
            />
          </Card>
          <Card>
            Receiver:
            <Input
              type="text"
              onChange={(e) => onChangeReceiver(e.target.value)}
              placeholder={state.receiver}
            />
          </Card>
        </Card>
      )}
      <div className="d-flex justify-content-center mb-2">
        <button type="button" className="btn btn-primary" onClick={handleMint}>
          {mintButton}
        </button>
      </div>
    </div>

    {state.showAlert && (
      <Widget src="jgodwill.near/widget/genalert" props={state} />
    )}
  </Main>
);
