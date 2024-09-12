--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Homebrew)
-- Dumped by pg_dump version 14.13 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: cart; Type: TABLE; Schema: public; Owner: marylag
--

CREATE TABLE public.cart (
    id integer NOT NULL,
    user_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    completed boolean DEFAULT false
);


ALTER TABLE public.cart OWNER TO marylag;

--
-- Name: cart_id_seq; Type: SEQUENCE; Schema: public; Owner: marylag
--

CREATE SEQUENCE public.cart_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cart_id_seq OWNER TO marylag;

--
-- Name: cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marylag
--

ALTER SEQUENCE public.cart_id_seq OWNED BY public.cart.id;


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: marylag
--

CREATE TABLE public.cart_items (
    id integer NOT NULL,
    cart_id integer,
    product_id integer,
    quantity integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cart_items OWNER TO marylag;

--
-- Name: cart_items_id_seq; Type: SEQUENCE; Schema: public; Owner: marylag
--

CREATE SEQUENCE public.cart_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.cart_items_id_seq OWNER TO marylag;

--
-- Name: cart_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marylag
--

ALTER SEQUENCE public.cart_items_id_seq OWNED BY public.cart_items.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: marylag
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer,
    product_id integer,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.order_items OWNER TO marylag;

--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: marylag
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.order_items_id_seq OWNER TO marylag;

--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marylag
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: marylag
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer,
    total_amount numeric(10,2) NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.orders OWNER TO marylag;

--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: marylag
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.orders_id_seq OWNER TO marylag;

--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marylag
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: marylag
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    description text,
    price numeric(10,2) NOT NULL,
    stock integer NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    image_url text
);


ALTER TABLE public.products OWNER TO marylag;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: marylag
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.products_id_seq OWNER TO marylag;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marylag
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: session; Type: TABLE; Schema: public; Owner: marylag
--

CREATE TABLE public.session (
    sid character varying NOT NULL,
    sess json NOT NULL,
    expire timestamp with time zone NOT NULL
);


ALTER TABLE public.session OWNER TO marylag;

--
-- Name: users; Type: TABLE; Schema: public; Owner: marylag
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255),
    first_name character varying(50),
    last_name character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    refresh_token text,
    oauth_provider character varying(255),
    oauth_id character varying(255)
);


ALTER TABLE public.users OWNER TO marylag;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: marylag
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO marylag;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: marylag
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: cart id; Type: DEFAULT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.cart ALTER COLUMN id SET DEFAULT nextval('public.cart_id_seq'::regclass);


--
-- Name: cart_items id; Type: DEFAULT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.cart_items ALTER COLUMN id SET DEFAULT nextval('public.cart_items_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: cart; Type: TABLE DATA; Schema: public; Owner: marylag
--

COPY public.cart (id, user_id, created_at, updated_at, completed) FROM stdin;
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: marylag
--

COPY public.cart_items (id, cart_id, product_id, quantity, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: marylag
--

COPY public.order_items (id, order_id, product_id, quantity, price, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: marylag
--

COPY public.orders (id, user_id, total_amount, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: marylag
--

COPY public.products (id, name, description, price, stock, created_at, updated_at, image_url) FROM stdin;
6	Crunchy Nut Dark Chocolate Bar	A delicious blend of premium dark chocolate and crunchy roasted nuts. This bar is perfect for those who crave the combination of rich cocoa flavor with the satisfying crunch of nuts. Enjoy it as a snack or share it with friends and family for a delightful treat.	5.49	140	2024-08-20 15:17:49.445153	2024-08-20 15:17:49.445153	https://i.imgur.com/JHRozOT.jpeg
7	Hazelnut Milk Chocolate Bar	A luxurious milk chocolate bar generously topped with whole roasted hazelnuts. The creamy chocolate melts in your mouth, while the rich, crunchy hazelnuts provide a delightful texture contrast. Perfect for nut lovers and chocolate aficionados alike.	6.99	130	2024-08-20 15:19:08.959966	2024-08-20 15:19:08.959966	https://i.imgur.com/1iAqnXV.jpeg
8	Gourmet Assorted Chocolate Bar Stack	A decadent collection of assorted chocolate bars, each crafted with premium ingredients. From creamy milk chocolate and white chocolate to crunchy nut and nougat-filled layers, this stack offers a variety of flavors and textures for every chocolate lover. Perfect for gifting or indulging in a diverse chocolate experience.	12.99	100	2024-09-04 19:17:18.579418	2024-09-04 19:17:18.579418	https://i.imgur.com/moV8B0i.jpeg
1	Dark Chocolate with Freeze-Dried Berries	A luxurious blend of rich dark chocolate topped with tangy freeze-dried berries. Perfectly balanced with a burst of fruity flavor and a deep cocoa base, this treat is crafted for chocolate connoisseurs and berry lovers alike.	6.99	150	2024-06-03 14:37:17.673328	2024-06-03 14:37:17.673328	https://i.imgur.com/vFblWCf.jpeg
2	Heart-Shaped Milk Chocolate Bites	Delightfully smooth milk chocolate crafted into adorable heart shapes. These rich and creamy bites are perfect for gifting or enjoying yourself. Each piece melts in your mouth, delivering a classic chocolate experience with a touch of love.	4.99	200	2024-06-03 14:37:17.673328	2024-06-03 14:37:17.673328	https://i.imgur.com/fFD3gee.jpeg
3	Artisan Lavender Dark Chocolate	A unique and sophisticated blend of smooth dark chocolate infused with a delicate hint of lavender. This handcrafted treat offers a rich and aromatic flavor experience, perfect for those who appreciate floral notes in their chocolate. Ideal for gifting or savoring during a peaceful moment.	7.49	120	2024-06-03 14:37:17.673328	2024-06-03 14:37:17.673328	https://i.imgur.com/GfQmUt5.jpeg
4	White Chocolate with Roasted Almonds	Creamy white chocolate paired with crunchy roasted almonds for a deliciously satisfying treat. The rich sweetness of white chocolate blends perfectly with the nutty flavor of whole almonds, offering a decadent experience with every bite. Perfect for those who love a combination of smooth and crunchy textures.	5.99	180	2024-06-03 14:37:17.673328	2024-06-03 14:37:17.673328	https://i.imgur.com/zlYuljy.jpeg
5	Creamy Dark Chocolate with Caramel Filling	Indulge in this decadent dark chocolate filled with smooth, gooey caramel. The perfectly balanced bittersweet chocolate exterior melts into a luscious caramel core, creating a luxurious treat for chocolate lovers. Ideal for savoring during special moments or sharing with loved ones.	6.49	160	2024-08-20 15:16:56.316264	2024-08-20 15:16:56.316264	https://i.imgur.com/MFWOIX6.jpeg
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: public; Owner: marylag
--

COPY public.session (sid, sess, expire) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: marylag
--

COPY public.users (id, username, email, password_hash, first_name, last_name, created_at, updated_at, refresh_token, oauth_provider, oauth_id) FROM stdin;
7	testuser	testuser@example.com	$2b$10$qYIf6oPTFgkkKINxQZoegusf73rbSW7N/iZQQKhcTy0kucPCFFf7W	Test	User	2024-08-14 20:26:43.465873	2024-08-14 20:26:43.465873	\N	\N	\N
11	admin	admin@gmai.com	$2b$10$1Rboeyg8dt6E5ENNAq4jReHpnU/BAZUNdC8UkYrUI2LlUUydDeMYW	Admin	Admin	2024-09-02 16:05:27.515591	2024-09-02 16:05:27.515591	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTEsImlhdCI6MTcyNTQzMjk4OSwiZXhwIjoxNzI2MDM3Nzg5fQ.l7MSHRdg5aoRmYR5L5kn1PnxE5y-oFsf3d_7Wc8KyIA	\N	\N
\.


--
-- Name: cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marylag
--

SELECT pg_catalog.setval('public.cart_id_seq', 23, true);


--
-- Name: cart_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marylag
--

SELECT pg_catalog.setval('public.cart_items_id_seq', 26, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marylag
--

SELECT pg_catalog.setval('public.order_items_id_seq', 11, true);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marylag
--

SELECT pg_catalog.setval('public.orders_id_seq', 9, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marylag
--

SELECT pg_catalog.setval('public.products_id_seq', 5, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: marylag
--

SELECT pg_catalog.setval('public.users_id_seq', 16, true);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: cart cart_pkey; Type: CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.session
    ADD CONSTRAINT session_pkey PRIMARY KEY (sid);


--
-- Name: users unique_email; Type: CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT unique_email UNIQUE (email);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: IDX_session_expire; Type: INDEX; Schema: public; Owner: marylag
--

CREATE INDEX "IDX_session_expire" ON public.session USING btree (expire);


--
-- Name: cart_items cart_items_cart_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_cart_id_fkey FOREIGN KEY (cart_id) REFERENCES public.cart(id);


--
-- Name: cart_items cart_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: cart cart_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.cart
    ADD CONSTRAINT cart_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: cart_items fk_cart; Type: FK CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fk_cart FOREIGN KEY (cart_id) REFERENCES public.cart(id);


--
-- Name: cart_items fk_product; Type: FK CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fk_product FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: order_items order_items_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: order_items order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id);


--
-- Name: orders orders_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: marylag
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

