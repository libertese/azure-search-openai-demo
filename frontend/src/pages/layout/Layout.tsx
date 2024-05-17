import { Outlet, NavLink, Link } from "react-router-dom";
import miranda from "../../assets/Miranda_do_Douro.png";
import styles from "./Layout.module.css";

const Layout = () => {
    return ( 
        <div>
            <header>

                
            </header>

            <Outlet />

        </div>
 //<div>
 //    <header>
 //        <nav className={`navbar ${styles.centerNavbar}`}>
 //            <div className={`col-md-12 d-flex justify-content-between`}>
 //                <div className={`row ${styles.divPai}`}>
 //                    <div className={`col-12 col-md-3 col-sm-12 mb-2 mb-md-0 d-none d-sm-none d-md-block ${styles.divleft}`}>                            
 //                        <a
 //                            className={`col-md-3 navbar-brand link-body-emphasis ${styles.headerNavLeftMargin} d-none d-sm-none d-md-block`}
 //                            href="https://www.cm-mdouro.pt/"
 //                            target={"_blank"}
 //                            title="Miranda do Douro Link"
 //                        >
 //                            <img
 //                                src={miranda}
 //                                alt="Miranda do Douro logo"
 //                                aria-label="Miranda do Douro Link"
 //                                className="bi d-none d-sm-none d-md-block"
 //                                width="auto"
 //                                height="60"
 //                            />
 //                        </a>
 //                    </div>
 //                    <div className={`col-12 col-md-6 col-sm-12 container-fluid ${styles.divcenter}`} style={{ display: 'flex', alignItems: 'center' }}>
 //                            <a className={`col-md-6 navbar-brand ${styles.titulo}`} href="/" title="Home" style={{ textDecoration: 'none' }}>
 //                                Guia Prático do Município
 //                            </a>
 //                    </div>
 //                    <div className={`col-3 col-md-3 ${styles.divright} d-none d-sm-none d-md-block`}>                                
 //                    </div>
 //                </div>
 //            </div>
 //        </nav>
 //    </header>
 //    <Outlet />
 //</div>

        // <div className={styles.layout}>
        //     <header className={styles.header} role={"banner"}>
        //         <div className={styles.headerContainer}>
        //             <div className="col-sm-3 hidden-xl">
        //                 <a href="https://www.cm-mdouro.pt/" target={"_blank"} title="Miranda do Douro Link">
        //                     <img src={miranda} alt="Miranda do Douro logo" aria-label="Miranda do Douro Link" className={styles.mirandaLogo} />
        //                 </a>
        //             </div>
        //             <div className={styles.divcenter}>
        //                 <Link to="/" className={styles.headerTitleContainer}>
        //                     <h3 className={styles.headerTitle}>AI-ChatGPT | Miranda do Douro</h3>
        //                 </Link>
        //             </div>
        //             <div className="hidden-xl">
        //                 <a href="https://www.cit-ttm.pt/" target={"_blank"} title="Dev by" className={styles.headerRightText}>
        //                     <h4 className={styles.headerRightText}>CIT TTM | TAC Services</h4>
        //                 </a>
        //             </div>
        //         </div>
        //     </header>

        //     <Outlet />
        // </div>


    );
};

export default Layout;
