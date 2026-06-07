type TSectionTitleProps = {
  title: string | number;
};
const SectionTitle = ({ title }: TSectionTitleProps) => {
  return <h2 className="text-md mt-4 font-semibold">{title}</h2>;
};

export default SectionTitle;
