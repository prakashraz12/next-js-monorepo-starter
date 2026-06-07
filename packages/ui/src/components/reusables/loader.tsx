const Loader = ({
  className = "",
  style,
}: {
  className?: string;
  style?: React.CSSProperties;
}) => (
  <div className={`loader-shimmer rounded-sm ${className}`} style={style} />
);

export default Loader;
