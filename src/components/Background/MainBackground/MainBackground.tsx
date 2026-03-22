import Spline from '@splinetool/react-spline';

export const MainBackground = () => {
  return (
    <Spline
      scene="media/Background3d/Background3d.splinecode"
      style={{ width: '100%', height: '100%' }}
      onLoad={(spline) => {
        const dpr = window.devicePixelRatio || 1.5;
        spline.setZoom(dpr > 1.5 ? 1.15 : 1.6);
      }}
    />
  );
};