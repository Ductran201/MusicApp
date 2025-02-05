"use client";

import Image from "next/image";
import {
  FaPlay,
  FaForwardFast,
  FaBackwardFast,
  FaShuffle,
  FaRepeat,
  FaVolumeHigh,
  FaEllipsis,
  FaPause,
  FaVolumeXmark,
} from "react-icons/fa6";
import React, { useState, useEffect, useRef } from "react";

const MusicPlayer = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRandom, setIsRandom] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  const [processMusic, setProcessMusic] = useState(0);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isVolume, setIsVolume] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const cdRef = useRef<HTMLDivElement | null>(null);
  const songListRef = useRef<HTMLDivElement | null>(null);

  const songs = [
    {
      name: "Âm thầm bên em",
      singer: "Sơn Tùng M-TP",
      path: "/audio/amThamBenEm.mp3",
      img: "/img/AmThamBenEm.jpg",
    },
    {
      name: "Say sóng",
      singer: "Tăng Nhật Tuệ",
      path: "/audio/saySong.mp3",
      img: "/img/100Love.jpg",
    },
    {
      name: "Vẫn nhớ",
      singer: "Tuấn Hưng",
      path: "/audio/vanNho.mp3",
      img: "/img/anhsems.jpg",
    },
    {
      name: "Say sóng",
      singer: "Tăng Nhật Tuệ",
      path: "/audio/saySong.mp3",
      img: "/img/PayPhone.jpg",
    },
    {
      name: "Mất kết nối",
      singer: "Duong Domic",
      path: "/audio/matKetNoi.mp3",
      img: "/img/TNOAL.jpg",
    },
    {
      name: "Dắt anh về nhà",
      singer: "Thoại Nghi",
      path: "/audio/datAnhVeNha.mp3",
      img: "/img/cuoithoi.jpg",
    },
    {
      name: "Chỉ muốn bên em lúc này",
      singer: "Thoại Nghi",
      path: "/audio/chiMuonBenEmLucNay.mp3",
      img: "/img/MuonRoiMaSaoCon.jpg",
    },
  ];

  const currentSong = songs[currentIndex];

  const loadCurrentSong = () => {
    if (audioRef.current) {
      audioRef.current.src = currentSong.path;
      if (isPlaying) audioRef.current.play();
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playRandomSong = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * songs.length);
    } while (newIndex === currentIndex);

    setCurrentIndex(newIndex);
  };

  const handleNextSong = () => {
    if (isRandom) {
      playRandomSong();
    } else {
      let newIndex = currentIndex + 1;
      if (newIndex >= songs.length) {
        newIndex = 0;
      }
      setCurrentIndex(newIndex);
    }
  };

  const handlePrevSong = () => {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) {
      newIndex = songs.length - 1;
    }
    setCurrentIndex(newIndex);
  };

  const handleRandom = () => {
    setIsRandom(!isRandom);
  };

  const handleRepeat = () => {
    setIsRepeat(!isRepeat);
  };

  const handleVolumeChange = (e: any) => {
    const newVolume = e.target.value;
    setVolume(newVolume);

    if (newVolume === "0") {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }

    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  const handleMute = (e: any) => {
    if (e.target.closest("input[type='range']")) return;
    if (isMuted) {
      setVolume(50);
      setIsMuted(false);
      if (audioRef.current) {
        audioRef.current.volume = 50 / 100;
      }
    } else {
      setVolume(0);
      setIsMuted(true);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
  };

  useEffect(() => {
    loadCurrentSong();
  }, [currentIndex]);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) return;

    const updateTime = () => {
      if (!isSeeking) {
        setProcessMusic(audio.currentTime);
      }
    };

    audio.addEventListener("timeupdate", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
    };
  }, [isSeeking, currentIndex]);

  // Khi bắt đầu kéo (tạm dừng cập nhật tự động)
  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  // Khi kéo thanh trượt
  const handleSeekTemp = (e: any) => {
    setProcessMusic(parseFloat(e.target.value));
  };

  // Khi nhả chuột, cập nhật thời gian thực
  const handleSeekFinal = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = processMusic;
    }
    setIsSeeking(false); // Cho phép cập nhật tự động từ `timeupdate`
  };

  useEffect(() => {
    if (audioRef.current) {
      const handleSongEnd = () => {
        if (isRandom) {
          playRandomSong();
        } else if (isRepeat) {
          audioRef.current?.play();
        } else {
          handleNextSong();
        }
      };

      audioRef.current.addEventListener("ended", handleSongEnd);

      return () => {
        audioRef.current?.removeEventListener("ended", handleSongEnd);
      };
    }
  }, [currentIndex, isRandom, isRepeat]);

  useEffect(() => {
    // Cuộn đến bài hát active khi currentIndex thay đổi
    if (songListRef.current) {
      const songElement = songListRef.current.children[
        currentIndex
      ] as HTMLElement;
      songElement?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleScroll = () => {
      if (!cdRef.current) return;

      const cdWidth = 190;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const newCDWidth = cdWidth - scrollTop;

      cdRef.current.style.width = `${newCDWidth}px`;

      cdRef.current.style.opacity = (newCDWidth / cdWidth).toString();

      // setScrollY(scrollTop);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // console.log(volume);
  return (
    <div className="relative">
      <div className="relative w-[414] mx-auto">
        <div className="fixed w-[414] bg-slate-100 z-50">
          <div className="p-3">
            <div className="text-center">
              {/* -- Header -- */}
              <div className=" text-[12] text-red-500 font-semibold pb-1">
                Now Playing
              </div>
              <div className=" font-bold text-[24]">{currentSong.name}</div>
              {/* -- CD -- */}
              <div
                ref={cdRef}
                className={`w-[190] py-3 mx-auto animate-spin [animation-duration:10s] `}
                style={{
                  animationPlayState: isPlaying ? "running" : "paused",
                }}
              >
                <Image
                  src={currentSong.img}
                  width={190}
                  height={190}
                  alt=""
                  className="rounded-full"
                />
              </div>
            </div>
            {/* -- Control -- */}
            <div className="relative flex justify-between mx-[60]">
              <div
                className="flex justify-center items-center px-[14] cursor-pointer"
                onClick={handleRepeat}
              >
                <FaRepeat className={isRepeat ? "text-red-500" : ""} />
              </div>
              <div
                className="flex justify-center items-center px-[14] cursor-pointer"
                onClick={handlePrevSong}
              >
                <FaBackwardFast />
              </div>
              <div
                className="w-[44] h-[44] text-white bg-red-500 rounded-full flex justify-center items-center cursor-pointer"
                onClick={handlePlayPause}
              >
                {isPlaying ? <FaPause /> : <FaPlay />}
              </div>
              <div
                className="flex justify-center items-center px-[14] cursor-pointer"
                onClick={handleNextSong}
              >
                <FaForwardFast />
              </div>
              <div
                className="flex justify-center items-center px-[14] cursor-pointer"
                onClick={handleRandom}
              >
                <FaShuffle className={isRandom ? "text-red-500" : ""} />
              </div>

              <div
                className="absolute top-[2] left-[-42] p-3 cursor-pointer"
                onClick={handleMute}
                onMouseEnter={() => setIsVolume(true)}
                onMouseLeave={() => setIsVolume(false)}
              >
                {isMuted || volume === 0 ? <FaVolumeXmark /> : <FaVolumeHigh />}

                {isVolume && (
                  <div className="volume-btn absolute py-3 bottom-[80] left-[-44] -rotate-90">
                    <input
                      min="0"
                      max="100"
                      step="1"
                      value={volume}
                      type="range"
                      onChange={handleVolumeChange}
                    />
                  </div>
                )}
              </div>
            </div>
            {/* -- Volume -- */}

            <div className="text-center pt-4 ">
              <input
                className="w-[50%]"
                type="range"
                min="0"
                max={audioRef.current?.duration || 100}
                value={processMusic}
                step="1"
                onMouseDown={handleSeekStart}
                onChange={handleSeekTemp}
                onMouseUp={handleSeekFinal}
              />
            </div>

            <audio ref={audioRef}></audio>
          </div>
        </div>

        <div
          className="absolute top-[368] w-[414] bg-[#b3a6a657]"
          ref={songListRef}
        >
          {songs.map((song, index) => (
            <div
              key={index}
              className={`song-item flex items-center bg-slate-100 m-3 rounded-xl cursor-pointer   duration-300 hover:shadow-xl  ${
                index === currentIndex ? "text-white !bg-red-500" : ""
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <div className="p-3">
                <img
                  width="190px"
                  height="190px"
                  className="w-[50] h-[50] rounded-full"
                  src={song.img}
                  alt={song.name}
                />
              </div>
              <div className="ml-[15]">
                <div className="song-title">{song.name}</div>
                <div className="mt-1 text-[12]">{song.singer}</div>
              </div>
              <div className="absolute right-[16] p-4 cursor-pointer">
                <FaEllipsis />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
