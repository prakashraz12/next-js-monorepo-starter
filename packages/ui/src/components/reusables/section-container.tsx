type SectionContainerProps = {
  title: string;
  value?: string | number;
  valuePrefix?: string | number;
  renderCustomValue?: React.ReactNode;
};
const SectionContainer = (props: SectionContainerProps) => {
  return (
    <div className="flex items-center gap-2">
      <p className="text-sm font-medium"> {props.title} : </p>
      {props?.renderCustomValue ? (
        props?.renderCustomValue
      ) : (
        <p className="text-sm font-medium text-gray-600 dark:text-white">
          {Number(props?.value) > 0 && props?.valuePrefix} {props.value || "--"}
        </p>
      )}
    </div>
  );
};

export default SectionContainer;
