import { SubComponent } from "my-lib";

const Component = ({ prop1, text }) => {
  return (
    <div>
      <SubComponent prop1={prop1}>{text}</SubComponent>
    </div>
  );
};

export default Checkbox;
