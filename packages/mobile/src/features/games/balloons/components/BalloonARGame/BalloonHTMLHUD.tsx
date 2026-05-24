import { useBalloonARGame } from "./BalloonARGame.context"

export const BalloonHTMLHUD = () => {
  const { data } = useBalloonARGame()

  if (data.countdown !== null) {
    const label = data.countdown === 0 ? "Go!" : `${data.countdown}`

    return (
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <span
          className="text-9xl font-black text-white"
          style={{
            textShadow:
              "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
          }}
        >
          {label}
        </span>
      </div>
    )
  }

  if (data.finished) {
    return (
      <div className="fixed inset-x-0 top-1/2 flex -translate-y-1/2 items-center justify-between bg-black/80 px-6 py-5">
        <p className="text-base font-bold text-white">
          {data.remaining === 0 ? "All balloons popped!" : "Time's up!"}
        </p>
        <p className="text-3xl font-black text-green-400">{data.score} pts</p>
        <button
          onClick={data.onConfirmExit}
          disabled={data.isPending}
          className="rounded-xl bg-green-500 px-6 py-2.5 text-base font-bold text-white disabled:bg-gray-500"
        >
          {data.isPending ? "Saving..." : "Continue"}
        </button>
      </div>
    )
  }

  if (!data.started) {
    return (
      <div className="pointer-events-none fixed inset-0 flex items-center justify-center">
        <p
          className="text-2xl font-bold text-white"
          style={{
            textShadow:
              "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
          }}
        >
          Get ready...
        </p>
      </div>
    )
  }

  return (
    <div className="pointer-events-none fixed inset-0">
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-around bg-black/60 px-6 py-3">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-white/70">
            Score
          </p>
          <p className="text-xl font-black text-white">{data.score}</p>
        </div>
        <div className="h-8 w-px bg-white/20" />
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-yellow-400/80">
            Time
          </p>
          <p className="text-xl font-black text-yellow-400">{data.timeLeft}s</p>
        </div>
        <div className="h-8 w-px bg-white/20" />
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-white/70">
            Left
          </p>
          <p className="text-xl font-black text-white">{data.remaining}</p>
        </div>
      </div>
    </div>
  )
}
