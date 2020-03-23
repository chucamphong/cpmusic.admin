import React, { MouseEvent, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Dropdown, Menu } from "antd";
import { HomeOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { useMedia } from "react-use";
import useAuth from "modules/Auth/hooks/useAuth";
import StyledMenuOutlined from "modules/Dashboard/components/StyledMenuOutlined";
import Logo from "modules/Dashboard/components/Logo";
import Avatar from "modules/Common/components/Avatar";
import Layout from "modules/Common/components/Layout";
import MyTheme from "utils/theme";
import Overlay from "modules/Dashboard/components/Overlay";

const siderWidth = MyTheme.sider.width;

const DashBoardContainer: React.FC = () => {
    const auth = useAuth();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState<boolean>(true);
    const isMobile = useMedia("(max-width: 576px");
    const toggleSider = () => setCollapsed(!collapsed);

    useEffect(() => {
        setCollapsed(isMobile);
    }, [isMobile]);

    const UserMenu = () => {
        const logout = (e: MouseEvent) => {
            e.preventDefault();
            auth.logout();
        };

        return (
            <Menu>
                <Menu.Item key={"/thong-tin"}>
                    <a href={"/thong-tin"}>Thông tin</a>
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key={"/dang-xuat"}>
                    <a href={"/dang-xuat"} onClick={logout}>Đăng xuất</a>
                </Menu.Item>
            </Menu>
        );
    };

    return (
        <Layout hasFixedSider collapsed={collapsed}>
            <Layout.Sider width={siderWidth} trigger={null} collapsed={collapsed} collapsedWidth={0} fixed collapsible>
                <Logo>
                    <Link to="/">CPMusic</Link>
                </Logo>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={[location.pathname]}>
                    <Menu.Item key="/">
                        <HomeOutlined/>
                        <Link to="/">
                            <span>Trang chủ</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="/users">
                        <UserOutlined/>
                        <Link to="/users">
                            <span>Thành viên</span>
                        </Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <VideoCameraOutlined/>
                        <span>nav 2</span>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <UploadOutlined/>
                        <span>nav 3</span>
                    </Menu.Item>
                </Menu>
            </Layout.Sider>
            {(isMobile && !collapsed) && <Overlay onClick={toggleSider}/>}
            <Layout hasFixedHeader collapsed={collapsed}>
                <Layout.Header fixed>
                    <StyledMenuOutlined onClick={toggleSider}/>
                    <Dropdown overlay={UserMenu} overlayStyle={{ width: 150 }} trigger={["click"]}>
                        <Avatar cursor size={"large"} alt="Avatar">
                            <UserOutlined/>
                        </Avatar>
                    </Dropdown>
                </Layout.Header>
                <Layout.Content margin={20} justify>
                    <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. A accusamus, vero. Blanditiis consequatur cumque, dolor earum hic inventore laboriosam magni minima neque quisquam sed sunt temporibus totam unde ut voluptatibus.</span><span>Ad, amet assumenda consequuntur corporis excepturi fugit magnam maiores, minima necessitatibus nemo nobis perspiciatis quas reiciendis similique tempora veniam veritatis voluptas! At blanditiis distinctio illo nihil, optio pariatur provident voluptatibus.</span><span>A delectus earum id iusto possimus quibusdam quod rerum, sunt tempore, vel, velit veniam. Adipisci eligendi ipsum molestias nemo quos repellendus sit ut voluptatem. Dignissimos harum id neque quidem veritatis.</span><span>Ab accusamus atque distinctio eaque earum eius enim explicabo iure mollitia nobis nostrum odio odit omnis optio quam quia, ratione unde vitae voluptatibus voluptatum. Cum est impedit quasi quia quis!</span><span>Officia, quas vitae! Accusantium amet asperiores beatae dignissimos distinctio dolore doloribus ea, eius est exercitationem fugit impedit incidunt maiores nihil odit officia porro provident quod quos reiciendis sapiente tempore totam.</span><span>Fuga labore modi officia, provident quidem similique veritatis! Eligendi, quo temporibus? Aperiam, distinctio, est eveniet exercitationem hic inventore ipsum iure maiores nisi placeat quis quisquam saepe sapiente ullam veritatis. Voluptate.</span><span>Dolore excepturi, fuga fugiat illo laboriosam omnis. Animi culpa cum deserunt dicta doloribus ea esse facilis ipsum iure magni mollitia necessitatibus qui quibusdam ratione, sunt suscipit tempore tenetur vitae, voluptatibus.</span><span>Aspernatur autem earum ex fuga, harum ipsam iste iure laborum libero magni minus molestias odio perferendis quaerat quas quidem quo sint, ut vero voluptatum! Eveniet iusto nostrum quas sint sit?</span><span>Mollitia quae quam quo veniam. Animi aut cupiditate, dolor eaque expedita in laborum laudantium libero nisi nobis placeat, quam quas, tenetur voluptate voluptatem. Doloremque eveniet iusto mollitia unde veniam voluptatem.</span><span>Alias amet asperiores deleniti eos harum, itaque mollitia nesciunt quia quis sequi sunt veritatis. Aut consequuntur debitis deserunt dolorum ducimus excepturi labore mollitia, natus numquam obcaecati quasi quia vel vero.</span><span>Amet asperiores cum cupiditate deserunt dolore enim et expedita, explicabo harum libero magni nam nisi numquam obcaecati placeat quia quod, similique tempora veritatis voluptates! Ab et exercitationem explicabo quibusdam ut?</span><span>Alias aspernatur atque aut culpa deleniti dignissimos distinctio dolore enim est, expedita id iste nisi non repudiandae, sint? Aliquam assumenda deleniti dignissimos error fuga maiores porro sit unde vero voluptatum.</span><span>Animi asperiores assumenda blanditiis delectus dicta dignissimos distinctio, dolore eligendi esse laudantium magnam maxime molestias nam nemo nisi nulla officiis quibusdam, quis sapiente voluptatibus. Amet at atque earum fugit provident.</span><span>A alias animi asperiores dicta dignissimos dolor dolores et expedita facere fugiat id ipsum natus nobis non provident, quae quam quidem quisquam reiciendis reprehenderit repudiandae similique vel vero voluptate voluptatum?</span><span>Accusantium aliquam beatae delectus deleniti illo molestias mollitia non quia repellat sunt? Aperiam debitis ducimus iusto laboriosam magnam nemo omnis optio praesentium quibusdam, quo repudiandae suscipit tempore veniam veritatis voluptatibus?</span><span>Aperiam deserunt doloribus dolorum facilis inventore quasi! Atque commodi cum deserunt mollitia voluptas. Alias deleniti excepturi fuga, hic impedit iure, nesciunt odio odit quia quibusdam repellendus sit veniam vero vitae.</span><span>Animi aut consequatur culpa cupiditate debitis distinctio dolor dolorum eaque eum expedita fuga, ipsam laborum minima modi nihil nisi non officiis porro praesentium quae qui rem repellat saepe tenetur ullam!</span><span>Aliquid, cumque, dolorum eligendi explicabo facere, fuga fugit ipsum laborum libero minus nisi quas quasi quidem quisquam reprehenderit sint vel vero voluptatum? Eos quo quos veniam. Distinctio eaque pariatur quo.</span><span>Assumenda consequatur consequuntur cum, doloremque exercitationem facilis modi molestiae mollitia natus officiis quae quam quas quis quisquam recusandae saepe sequi, totam ut veritatis voluptate. Amet assumenda molestiae perferendis veritatis vero.</span><span>Aspernatur culpa delectus dignissimos ea eos expedita illum incidunt maiores natus nisi optio perspiciatis praesentium quisquam rerum, sed sit sunt. Ab aperiam cumque deleniti ipsam iure maxime quisquam! Excepturi, quis.</span><span>Adipisci amet architecto aspernatur iure iusto necessitatibus recusandae sint, sunt, ullam unde voluptas, voluptatibus. Ad animi cumque distinctio doloremque in incidunt quam tempora veritatis! Explicabo illo odio optio sequi voluptatum?</span><span>Ad animi blanditiis cupiditate deleniti deserunt dolores est exercitationem fugiat impedit inventore ipsam libero magni modi nisi obcaecati odio, officia, omnis placeat praesentium reprehenderit rerum sequi sint, velit veritatis voluptatibus!</span><span>Architecto at debitis distinctio doloremque eaque facere fuga laudantium modi molestiae officiis optio possimus quae quasi quisquam quos rerum sint sunt, vel. Est illum magni nam qui, voluptas voluptatibus voluptatum!</span><span>Consectetur dolor, eos itaque laboriosam laudantium necessitatibus reiciendis tempora. Accusantium aliquid, at atque culpa cumque ea eos excepturi inventore ipsa molestias neque numquam, pariatur placeat possimus qui rerum suscipit vero!</span><span>Corporis fuga ipsum iure magnam, placeat praesentium quod tempora voluptatem. Animi ea eos, impedit magni molestias natus praesentium quas quidem sit tenetur vel vitae voluptatum. Aspernatur eveniet ipsam sed vitae.</span><span>Assumenda dignissimos doloremque eius explicabo fugiat, impedit laboriosam libero obcaecati placeat quaerat quasi qui rem veritatis? Accusamus alias architecto assumenda dicta necessitatibus pariatur repudiandae similique tempora. Laudantium quia vitae voluptas?</span><span>At autem, commodi consequatur dignissimos dolore, dolorem doloremque ducimus ea, est excepturi minus natus necessitatibus numquam optio quas quasi reiciendis reprehenderit saepe similique ullam velit veniam vitae? Distinctio, placeat, vitae!</span><span>Cupiditate ipsum, iure minima provident veniam voluptates. Ad consequuntur delectus, dicta dignissimos dolore ea eius error esse itaque iusto minus, nam nemo, obcaecati odit sed sequi ut? Eum, fugit unde!</span><span>Amet architecto at commodi consequuntur, doloremque esse est fuga id modi nesciunt nostrum, odit reiciendis sint ullam vel? Cum dolores eligendi eum hic inventore labore magnam officiis ratione saepe voluptates.</span><span>Corporis eos esse ipsa laudantium natus nobis officia provident quae tempore voluptates? Aliquam amet aspernatur consequatur dicta distinctio eligendi fugit iste laborum molestias obcaecati odio possimus qui, quia ratione tempore!</span><span>Ab aperiam consequuntur corporis culpa cumque deserunt dolore dolorem eius est eum expedita facilis iste labore laborum odio officiis possimus quas quod ratione repellat, suscipit totam velit voluptas voluptatem voluptatibus!</span><span>Et expedita, ipsum maxime non possimus praesentium quisquam rem sed ut voluptas? Assumenda consectetur enim fugiat illum in iusto magnam minima officia quam quidem, rem sint ut vel. Adipisci, dicta!</span><span>Adipisci impedit iste nisi omnis, optio perspiciatis. Blanditiis cupiditate ducimus eveniet, ipsa maiores officia officiis rerum vero! Aliquam blanditiis commodi illum magnam nemo non, nostrum, reiciendis, sunt temporibus vero voluptates.</span><span>Blanditiis dicta facilis, laboriosam nemo quis sunt. Animi aut eaque vitae voluptas. Aliquid excepturi illo, incidunt ipsa iusto molestias officiis saepe voluptate! Amet dolore ducimus incidunt molestiae nemo praesentium ratione?</span><span>Atque perferendis, quis. Aliquid aperiam commodi, cupiditate deserunt dolorem earum excepturi facere fuga iste magni minima nisi non officia officiis perspiciatis quasi, quidem reiciendis sunt vero voluptas. Atque, corporis, saepe?</span><span>Aliquam delectus dolorem dolores doloribus explicabo fuga ipsam laudantium maxime minima nemo nesciunt nobis non, possimus provident qui saepe ut vel voluptate? Dolorum facilis ipsam itaque nemo repudiandae sequi ut?</span><span>Ad alias aliquam aperiam cupiditate deserunt eaque, eius eos esse eveniet ex facere illo ipsa nam nemo nihil officia perferendis perspiciatis quos ratione recusandae, tempora tempore ullam unde. Animi, laudantium?</span><span>Alias animi consectetur consequatur deleniti dolorem ea eos exercitationem, facere illo ipsum laborum laudantium minus molestiae molestias mollitia obcaecati, omnis placeat porro possimus provident quae quis repellendus veritatis vero voluptas.</span><span>Ab doloremque ea fugit itaque quis, quisquam quod recusandae unde. Aliquam, amet, aperiam asperiores commodi consectetur corporis cupiditate eveniet expedita impedit itaque magni minus non quos, repellendus sequi temporibus veritatis!</span><span>A beatae, delectus dolores ducimus est excepturi labore laboriosam quisquam quo quod soluta temporibus totam! Aliquam asperiores at deleniti, dignissimos excepturi id libero magnam modi omnis, pariatur praesentium quisquam repellat.</span><span>A atque delectus excepturi magnam nulla numquam odio odit officiis quos similique? Architecto esse eveniet expedita impedit nam neque quam quibusdam saepe vel voluptates. Delectus enim facere similique totam velit?</span><span>Aperiam aut consequuntur, delectus deleniti eaque eligendi eos facere ipsam laborum libero molestiae necessitatibus nesciunt nisi nobis praesentium provident reprehenderit, rerum soluta ullam vero! Consectetur dolorum molestias sint sunt ut?</span><span>Accusantium alias animi corporis deleniti, dolorum earum eligendi excepturi impedit ipsam maiores odit officiis omnis porro praesentium quis ratione rerum sapiente sint soluta vero? Accusamus aspernatur atque dolorum magnam sequi?</span><span>A alias at atque autem blanditiis consequatur cum deserunt dolorem explicabo facere hic illo, laborum nemo officia placeat recusandae sequi tempora voluptas voluptates voluptatibus? Consequatur doloremque quam repellendus sapiente temporibus.</span><span>Expedita ipsa laboriosam laborum modi nulla perferendis totam. A ad aut corporis earum eos, facilis fuga id incidunt, itaque maxime molestias nemo neque non nostrum nulla odio pariatur rerum vel.</span><span>Commodi fugit laborum necessitatibus officiis placeat quaerat ratione, repellendus sed. Ab ad aut eius, esse explicabo maxime molestias nam obcaecati optio porro repellat saepe, sapiente soluta, sunt ullam ut voluptate.</span><span>Consequatur corporis cum eaque earum eos ex fuga illo, magni minima, modi natus, nemo nesciunt odio officiis quaerat quam quis recusandae reiciendis repudiandae sequi temporibus tenetur totam! Debitis, deleniti, necessitatibus!</span><span>Aspernatur commodi consequatur consequuntur culpa delectus deleniti doloremque doloribus ea eligendi et harum inventore, laboriosam laborum magni maiores nam neque, quisquam quo quod rerum saepe ullam ut veniam voluptas voluptate?</span><span>Ad adipisci architecto, atque consequatur dicta dolore, doloremque eaque eius eum fuga id maxime molestias necessitatibus nulla quam tenetur, ut vero voluptates. Aspernatur earum molestias odio odit omnis porro voluptatibus!</span><span>Ab illum iure iusto, non quas repellendus repudiandae unde ut. Accusamus, ad aliquid asperiores aut doloribus eius eligendi ipsam libero tenetur. Ad aperiam nemo quas? Exercitationem in quae rerum ut.</span>
                </Layout.Content>
            </Layout>
        </Layout>
    );
};

export default DashBoardContainer;