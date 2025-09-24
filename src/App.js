import React from "react";
import "./App.css";

const gallery = [
  {
    type: "image",
    url: "https://upload.wikimedia.org/wikipedia/commons/6/6a/Mona_Lisa.jpg",
    prompt: "Mona Lisa by Leonardo da Vinci — the most famous portrait in the world."
  },
  {
    type: "image",
    url: "https://upload.wikimedia.org/wikipedia/commons/8/86/Vincent_van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg",
    prompt: "The Starry Night by Vincent van Gogh — swirling night sky over a quiet town."
  },
  {
    type: "image",
    url: "https://upload.wikimedia.org/wikipedia/commons/0/04/The_Scream.jpg",
    prompt: "The Scream by Edvard Munch — a powerful expression of anxiety and emotion."
  },
  {
    type: "image",
    url: "https://upload.wikimedia.org/wikipedia/commons/7/74/The_Persistence_of_Memory.jpg",
    prompt: "The Persistence of Memory by Salvador Dalí — melting clocks in a surreal landscape."
  },
  {
    type: "image",
    url: "https://upload.wikimedia.org/wikipedia/commons/4/4c/Claude_Monet_-_Impression%2C_Sunrise.jpg",
    prompt: "Impression, Sunrise by Claude Monet — the painting that gave Impressionism its name."
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
    prompt: "Sunrise over misty mountains, inspiring a fresh start."
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=1200&q=85",
    prompt: "A stream of light and color in a busy city street."
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=1200&q=85",
    prompt: "The solitude of a tree in an endless field, symbolizing resilience."
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=1200&q=85",
    prompt: "A dramatic mountain peak under a stormy sky."
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1454023492550-5696f8ff10e1?auto=format&fit=crop&w=1200&q=85",
    prompt: "A minimalist snowy landscape with a single red cabin."
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1465101178521-c1a9136a3c5a?auto=format&fit=crop&w=1200&q=85",
    prompt: "Abstract reflections on water, blending colors and shapes."
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1200&q=85",
    prompt: "A vibrant street mural full of life and creativity."
  },
  {
    type: "image",
    url: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=85",
    prompt: "Golden hour light streaming through a dense forest."
  },
  {
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg",
    prompt: "Art video: Smooth camera movement in nature and playful colors."
  },
  {
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg",
    prompt: "Art video: A surreal narrative of industrial spaces."
  },
  {
    type: "video",
    url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    poster: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg",
    prompt: "Art video: Fusion of technology and emotion in an urban setting."
  }
];

function App() {
  return (
    <div className="container">
      <h1 className="title">Nikoo Studio</h1>
      <div className="gallery">
        {gallery.map((item, idx) => (
          <div className="gallery-item" key={idx}>
            {item.type === "image" ? (
              <img src={item.url} alt={item.prompt} className="gallery-img" loading="lazy" />
            ) : (
              <video
                controls
                className="gallery-img"
                preload="metadata"
                poster={item.poster}
                playsInline
                controlsList="nodownload noplaybackrate"
              >
                <source src={item.url} type="video/mp4" />
                Your browser does not support video playback.
              </video>
            )}
            <div className="prompt">{item.prompt}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

