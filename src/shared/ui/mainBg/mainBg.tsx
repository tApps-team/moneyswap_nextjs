import styles from "./mainBg.module.scss";
import { Path_1 } from "./path_1";
import { Path_2 } from "./path_2";
import { Path_3 } from "./path_3";
import { Path_4 } from "./path_4";
import { Path_5 } from "./path_5";
import { Path_6 } from "./path_6";
export const MainBg = (props: any) => {
  return (
    <div className={styles.container}>
      <div className={styles.paths_container}>
        <div className={styles.path}>
          <Path_1 />
        </div>
        <div className={styles.path}>
          <Path_2 />
        </div>
        <div className={styles.path}>
          <Path_3 />
        </div>
        <div className={styles.path}>
          <Path_4 />
        </div>
        <div className={styles.path}>
          <Path_5 />
        </div>
        <div className={styles.path}>
          <Path_6 />
        </div>
        <div className={styles.path}>
          <Path_1 />
        </div>
        <div className={styles.path}>
          <Path_2 />
        </div>
        <div className={styles.path}>
          <Path_3 />
        </div>
        <div className={styles.path}>
          <Path_4 />
        </div>
        <div className={styles.path}>
          <Path_5 />
        </div>
        <div className={styles.path}>
          <Path_6 />
        </div>
        <div className={styles.path}>
          <Path_1 />
        </div>
        <div className={styles.path}>
          <Path_2 />
        </div>
        <div className={styles.path}>
          <Path_3 />
        </div>
        <div className={styles.path}>
          <Path_4 />
        </div>
        <div className={styles.path}>
          <Path_5 />
        </div>
        <div className={styles.path}>
          <Path_6 />
        </div>
      </div>
      <div className={styles.overlay}></div>
    </div>
  );
};
