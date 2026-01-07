import ClickSpark from "@/components/ClickSpark";

export const ClickSparkProvider = () => {
  return (
    <ClickSpark
      sparkColor="#000"
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      {/* Your content here */}
    </ClickSpark>
  );
};
