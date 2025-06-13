const useVoice = () => {
  const playText = async (text: string) => {
    const res = await fetch("/api/voice", {
      method: "POST",
      body: JSON.stringify({ text }),
      headers: { "Content-Type": "application/json" },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const audio = new Audio(url);
    audio.play();
  };

  return { playText };
};

export default useVoice;
