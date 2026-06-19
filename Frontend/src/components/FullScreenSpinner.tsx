import JokiLoader from "./JokiLoader";

export default function FullScreenLoading() {
  return (
    <div
      className="
        min-h-screen
        bg-[#12201b]
        flex
        items-center
        justify-center
      "
    >
      <JokiLoader />
    </div>
  );
}