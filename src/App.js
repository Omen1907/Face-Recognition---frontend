import "./App.css";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import Signin from "./components/Signin/Signin";
import Register from "./components/Register/Register";
import ParticlesBg from "particles-bg";
import { useState } from "react";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";

function App() {
  const [initalState, setInitialState] = useState("");
  const [inputBar, setInputBar] = useState(null);
  const [box, setBox] = useState({});
  const [route, setRoute] = useState("signin"); // ✅ Start at Signin
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: "",
    name: "",
    email: "",
    entries: 0,
    joined: "",
  });

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined,
    });
  };

  const calculateFaceLocation = (data) => {
    if (!data?.outputs?.[0]?.data?.regions?.[0]?.region_info?.bounding_box) {
      return {}; // Return empty object if no face is detected
    }
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("inputImage");
    if (!image) return {}; // Handle case where image isn't loaded yet
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: height - clarifaiFace.bottom_row * height,
    };
  };

  const displayFaceBox = (box) => {
    setBox(box);
  };

  const onInputChange = (event) => {
    setInputBar(event.target.value);
  };

  const returnRequestOptions = (imageURL) => {
    const PAT = "ffff3cf8d25943c5b8f9411102c92bf9"; // Still need to hide PAT
    const USER_ID = "wzfbzddr7xj5";
    const APP_ID = "Portfolio-1";

    const raw = JSON.stringify({
      user_app_id: {
        user_id: USER_ID,
        app_id: APP_ID,
      },
      inputs: [
        {
          data: {
            image: {
              url: imageURL,
            },
          },
        },
      ],
    });

    return {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Key ${PAT}`,
        "Content-Type": "application/json", // Added to fix "Method Not Allowed"
      },
      body: raw,
    };
  };

  const onButtonSubmit = () => {
    fetch(
      "https://api.clarifai.com/v2/models/face-detection/outputs",
      returnRequestOptions(inputBar)
    )
      .then((response) => {
        console.log("API Response:", response);
        if (response) {
          fetch("http://localhost:3000/image", {
            method: "post",
            mode: "cors",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: user.id,
            }),
          })
            .then((response) => {
              console.log("Response Status:", response.status);
              console.log("Response Headers:", response.headers);
              response.json();
            })
            .then((count) => {
              setUser((prevUser) => ({ ...prevUser, entries: count }));
            })
            .catch((err) => console.log("Error updating entries:", err));

          const faceBox = calculateFaceLocation(response);
          displayFaceBox(faceBox);
        }
      })
      .catch((err) => console.log("Error:", err));
  };

  const onRouteChange = (route) => {
    if (route === "signout") {
      setIsSignedIn(false);
      setInitialState();
    } else if (route === "home") {
      setIsSignedIn(true);
    }
    setRoute(route);
  };

  return (
    <div className='App'>
      <ParticlesBg type='cobweb' bg={true} />
      <Navigation onRouteChange={onRouteChange} isSignedIn={isSignedIn} />
      {route === "home" ? (
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries} />
          <ImageLinkForm
            onInputChange={onInputChange}
            onButtonSubmit={onButtonSubmit}
          />
          <FaceRecognition box={box} imageURL={inputBar} />
        </div>
      ) : route === "signin" ? ( // ✅ Fix route name
        <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
      ) : (
        <Register loadUser={loadUser} onRouteChange={onRouteChange} />
      )}
    </div>
  );
}

export default App;
