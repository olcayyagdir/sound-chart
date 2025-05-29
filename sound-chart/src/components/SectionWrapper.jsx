import styles from "./SectionWrapper.module.css";
import clsx from "clsx";

export default function SectionWrapper({ children, className, id }) {
  return (
    <section id={id} className={clsx(styles.sectionWrapper, className)}>
      {children}
    </section>
  );
}
