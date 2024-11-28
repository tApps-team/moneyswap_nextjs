import styles from "./loader.module.scss";

export const LoaderAnimation = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.ring}>
        <span></span>
      </div>
    </div>
  );
};
