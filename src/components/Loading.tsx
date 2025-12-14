import BeatLoader from "react-spinners/BeatLoader";

type LoadingProps={
  isLoading:boolean;
}

export default function Loading({ isLoading }:LoadingProps):JSX.Element {
  return (<>
    {isLoading && (
      <div style={{
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 10,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backdropFilter: 'blur(3px)',
      }}>
        <BeatLoader color="#a4d6e3" loading={true} size={20} />
      </div>
    )}
  </>
  )
}