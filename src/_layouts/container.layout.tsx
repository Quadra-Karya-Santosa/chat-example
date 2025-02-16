interface ContainerProps {
  children: React.ReactNode;
  className?: string
}

const Container: React.FC<ContainerProps> = ({
  children,
  className
}) => {
  return (
    <div
      className={`bg-slate-100 max-h-screen h-screen overflow-auto p-3 ${className}`}
    >
      {children}
    </div>
  );
};

export default Container
