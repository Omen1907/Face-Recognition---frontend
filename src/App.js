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

  const onButtonSubmit = async () => {
    if (!inputBar || !inputBar.match(/\.(jpg|jpeg|png)$/i)) {
      alert("Please enter a valid image URL (jpg or png)");
      return;
    }

    try {
      // Call your own backend instead of Clarifai directly
      const response = await fetch("http://localhost:3001/imageurl", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input: inputBar }),
      });

      if (!response.ok) {
        throw new Error(
          `Backend API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log("Backend API Response:", data);

      if (data.status.code !== 10000 || !data.outputs?.[0]?.data?.regions) {
        throw new Error("No faces detected or invalid API response");
      }

      // Process face detection
      const faceBox = calculateFaceLocation(data);
      displayFaceBox(faceBox);

      // Update user entries in backend
      const updateResponse = await fetch("http://localhost:3001/image", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: user.id }),
      });

      if (!updateResponse.ok) {
        throw new Error(
          `Backend error: ${updateResponse.status} ${updateResponse.statusText}`
        );
      }

      const count = await updateResponse.json();
      setUser((prevUser) => ({ ...prevUser, entries: count.entries || count }));
    } catch (err) {
      console.error("Error:", err);
      alert(
        "Failed to process image. Please check the image URL and try again."
      );
    }
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
