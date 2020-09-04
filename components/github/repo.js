import utilStyles from "../../styles/utils.module.scss";

export default function Repo({ name, toggleStatus }) {
  return (
    <div>
      {name} {toggleStatus ? "true" : "false"}
    </div>
  );
}
