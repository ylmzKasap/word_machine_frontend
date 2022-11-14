export function play_audio (mixer: HTMLAudioElement, message: string) {
  mixer.load();
  mixer.oncanplay = () => {
    let playPromise = mixer.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn(message);
      });
    }
  };
}
