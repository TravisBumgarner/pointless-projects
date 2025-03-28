const Counter = ({ current, total }: { current: number; total: number }) => {
  return (
    <div>
      {current} / {total}
    </div>
  );
};

export default Counter;
