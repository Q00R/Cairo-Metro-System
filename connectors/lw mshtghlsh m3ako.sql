--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

-- Started on 2023-06-09 22:37:18

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

--
-- TOC entry 6 (class 2615 OID 33280)
-- Name: se_project; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA se_project;


ALTER SCHEMA se_project OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 232 (class 1259 OID 33389)
-- Name: refund_requests; Type: TABLE; Schema: se_project; Owner: postgres
--

CREATE TABLE se_project.refund_requests (
    id integer NOT NULL,
    status text NOT NULL,
    "userId" integer NOT NULL,
    "refundAmount" integer NOT NULL,
    "ticketId" integer NOT NULL
);


ALTER TABLE se_project.refund_requests OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 33388)
-- Name: refund_requests_id_seq; Type: SEQUENCE; Schema: se_project; Owner: postgres
--

CREATE SEQUENCE se_project.refund_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE se_project.refund_requests_id_seq OWNER TO postgres;

--
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 231
-- Name: refund_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: se_project; Owner: postgres
--

ALTER SEQUENCE se_project.refund_requests_id_seq OWNED BY se_project.refund_requests.id;


--
-- TOC entry 228 (class 1259 OID 33356)
-- Name: rides; Type: TABLE; Schema: se_project; Owner: postgres
--

CREATE TABLE se_project.rides (
    id integer NOT NULL,
    status text NOT NULL,
    origin text NOT NULL,
    destination text NOT NULL,
    "userId" integer NOT NULL,
    "ticketId" integer NOT NULL,
    "tripDate" timestamp without time zone NOT NULL
);


ALTER TABLE se_project.rides OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 33355)
-- Name: rides_id_seq; Type: SEQUENCE; Schema: se_project; Owner: postgres
--

CREATE SEQUENCE se_project.rides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE se_project.rides_id_seq OWNER TO postgres;

--
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 227
-- Name: rides_id_seq; Type: SEQUENCE OWNED BY; Schema: se_project; Owner: postgres
--

ALTER SEQUENCE se_project.rides_id_seq OWNED BY se_project.rides.id;


--
-- TOC entry 220 (class 1259 OID 33300)
-- Name: roles; Type: TABLE; Schema: se_project; Owner: postgres
--

CREATE TABLE se_project.roles (
    id integer NOT NULL,
    role text NOT NULL
);


ALTER TABLE se_project.roles OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 33299)
-- Name: roles_id_seq; Type: SEQUENCE; Schema: se_project; Owner: postgres
--

CREATE SEQUENCE se_project.roles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE se_project.roles_id_seq OWNER TO postgres;

--
-- TOC entry 3462 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_id_seq; Type: SEQUENCE OWNED BY; Schema: se_project; Owner: postgres
--

ALTER SEQUENCE se_project.roles_id_seq OWNED BY se_project.roles.id;


--
-- TOC entry 238 (class 1259 OID 33431)
-- Name: routes; Type: TABLE; Schema: se_project; Owner: postgres
--

CREATE TABLE se_project.routes (
    id integer NOT NULL,
    "routeName" text NOT NULL,
    "fromStationId" integer NOT NULL,
    "toStationId" integer NOT NULL
);


ALTER TABLE se_project.routes OWNER TO postgres;

--
-- TOC entry 237 (class 1259 OID 33430)
-- Name: routes_id_seq; Type: SEQUENCE; Schema: se_project; Owner: postgres
--

CREATE SEQUENCE se_project.routes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE se_project.routes_id_seq OWNER TO postgres;

--
-- TOC entry 3463 (class 0 OID 0)
-- Dependencies: 237
-- Name: routes_id_seq; Type: SEQUENCE OWNED BY; Schema: se_project; Owner: postgres
--

ALTER SEQUENCE se_project.routes_id_seq OWNED BY se_project.routes.id;


--
-- TOC entry 234 (class 1259 OID 33408)
-- Name: senior_requests; Type: TABLE; Schema: se_project; Owner: postgres
--

CREATE TABLE se_project.senior_requests (
    id integer NOT NULL,
    status text NOT NULL,
    "userId" integer NOT NULL,
    "nationalId" integer NOT NULL
);


ALTER TABLE se_project.senior_requests OWNER TO postgres;

--
-- TOC entry 233 (class 1259 OID 33407)
-- Name: senior_requests_id_seq; Type: SEQUENCE; Schema: se_project; Owner: postgres
--

CREATE SEQUENCE se_project.senior_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE se_project.senior_requests_id_seq OWNER TO postgres;

--
-- TOC entry 3464 (class 0 OID 0)
-- Dependencies: 233
-- Name: senior_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: se_project; Owner: postgres
--

ALTER SEQUENCE se_project.senior_requests_id_seq OWNED BY se_project.senior_requests.id;


--
-- TOC entry 218 (class 1259 OID 33291)
-- Name: sessions; Type: TABLE; Schema: se_project; Owner: postgres
--

CREATE TABLE se_project.sessions (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    token text NOT NULL,
    "expiresAt" timestamp without time zone NOT NULL
);


ALTER TABLE se_project.sessions OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 33290)
-- Name: sessions_id_seq; Type: SEQUENCE; Schema: se_project; Owner: postgres
--

CREATE SEQUENCE se_project.sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE se_project.sessions_id_seq OWNER TO postgres;

--
-- TOC entry 3465 (class 0 OID 0)
-- Dependencies: 217
-- Name: sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: se_project; Owner: postgres
--

ALTER SEQUENCE se_project.sessions_id_seq OWNED BY se_project.sessions.id;


--
-- TOC entry 240 (class 1259 OID 33450)
-- Name: stationRoutes; Type: TABLE; Schema: se_project; Owner: postgres
--

CREATE TABLE se_project."stationRoutes" (
    id integer NOT NULL,
    "stationId" integer NOT NULL,
    "routeId" integer NOT NULL
);


ALTER TABLE se_project."stationRoutes" OWNER TO postgres;

--
-- TOC entry 239 (class 1259 OID 33449)
-- Name: stationroutes_id_seq; Type: SEQUENCE; Schema: se_project; Owner: postgres
--

CREATE SEQUENCE se_project.stationroutes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE se_project.stationroutes_id_seq OWNER TO postgres;

--
-- TOC entry 3466 (class 0 OID 0)
-- Dependencies: 239
-- Name: stationroutes_id_seq; Type: SEQUENCE OWNED BY; Schema: se_project; Owner: postgres
--

ALTER SEQUENCE se_project.stationroutes_id_seq OWNED BY se_project."stationRoutes".id;


--
-- TOC entry 236 (class 1259 OID 33422)
-- Name: stations; Type: TABLE; Schema: se_project; Owner: postgres
--

CREATE TABLE se_project.stations (
    id integer NOT NULL,
    "stationName" text NOT NULL,
    "stationType" text NOT NULL,
    "stationPosition" text,
    "stationStatus" text NOT NULL
);


ALTER TABLE se_project.stations OWNER TO postgres;

--
-- TOC entry 235 (class 1259 OID 33421)
-- Name: stations_id_seq; Type: SEQUENCE; Schema: se_project; Owner: postgres
--

CREATE SEQUENCE se_project.stations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE se_project.stations_id_seq OWNER TO postgres;

--
-- TOC entry 3467 (class 0 OID 0)
-- Dependencies: 235
-- Name: stations_id_seq; Type: SEQUENCE OWNED BY; Schema: se_project; Owner: postgres
--

ALTER SEQUENCE se_project.stations_id_seq OWNED BY se_project.stations.id;


--
-- TOC entry 224 (class 1259 OID 33318)
-- Name: subsription; Type: TABLE; Schema: se_project; Owner: postgres
--

CREATE TABLE se_project.subsription (
    id integer NOT NULL,
    "subType" text NOT NULL,
    "zoneId" integer NOT NULL,
    "userId" integer NOT NULL,
    "noOfTickets" integer NOT NULL
);


ALTER TABLE se_project.subsription OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 33317)
-- Name: subsription_id_seq; Type: SEQUENCE; Schema: se_project; Owner: postgres
--

CREATE SEQUENCE se_project.subsription_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE se_project.subsription_id_seq OWNER TO postgres;

--
-- TOC entry 3468 (class 0 OID 0)
-- Dependencies: 223
-- Name: subsription_id_seq; Type: SEQUENCE OWNED BY; Schema: se_project; Owner: postgres
--

ALTER SEQUENCE se_project.subsription_id_seq OWNED BY se_project.subsription.id;


--
-- TOC entry 226 (class 1259 OID 33337)
-- Name: tickets; Type: TABLE; Schema: se_project; Owner: postgres
--

CREATE TABLE se_project.tickets (
    id integer NOT NULL,
    origin text NOT NULL,
    destination text NOT NULL,
    "userId" integer NOT NULL,
    "subId" integer,
    "tripDate" timestamp without time zone NOT NULL
);


ALTER TABLE se_project.tickets OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 33336)
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: se_project; Owner: postgres
--

CREATE SEQUENCE se_project.tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE se_project.tickets_id_seq OWNER TO postgres;

--
-- TOC entry 3469 (class 0 OID 0)
-- Dependencies: 225
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: se_project; Owner: postgres
--

ALTER SEQUENCE se_project.tickets_id_seq OWNED BY se_project.tickets.id;


--
-- TOC entry 230 (class 1259 OID 33375)
-- Name: transactions; Type: TABLE; Schema: se_project; Owner: postgres
--

CREATE TABLE se_project.transactions (
    id integer NOT NULL,
    amount integer NOT NULL,
    "userId" integer NOT NULL,
    "purchasedId" integer NOT NULL,
    type text NOT NULL
);


ALTER TABLE se_project.transactions OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 33374)
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: se_project; Owner: postgres
--

CREATE SEQUENCE se_project.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE se_project.transactions_id_seq OWNER TO postgres;

--
-- TOC entry 3470 (class 0 OID 0)
-- Dependencies: 229
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: se_project; Owner: postgres
--

ALTER SEQUENCE se_project.transactions_id_seq OWNED BY se_project.transactions.id;


--
-- TOC entry 216 (class 1259 OID 33282)
-- Name: users; Type: TABLE; Schema: se_project; Owner: postgres
--

CREATE TABLE se_project.users (
    id integer NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "roleId" integer NOT NULL
);


ALTER TABLE se_project.users OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 33281)
-- Name: users_id_seq; Type: SEQUENCE; Schema: se_project; Owner: postgres
--

CREATE SEQUENCE se_project.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE se_project.users_id_seq OWNER TO postgres;

--
-- TOC entry 3471 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: se_project; Owner: postgres
--

ALTER SEQUENCE se_project.users_id_seq OWNED BY se_project.users.id;


--
-- TOC entry 222 (class 1259 OID 33309)
-- Name: zones; Type: TABLE; Schema: se_project; Owner: postgres
--

CREATE TABLE se_project.zones (
    id integer NOT NULL,
    "zoneType" text NOT NULL,
    price integer NOT NULL
);


ALTER TABLE se_project.zones OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 33308)
-- Name: zones_id_seq; Type: SEQUENCE; Schema: se_project; Owner: postgres
--

CREATE SEQUENCE se_project.zones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE se_project.zones_id_seq OWNER TO postgres;

--
-- TOC entry 3472 (class 0 OID 0)
-- Dependencies: 221
-- Name: zones_id_seq; Type: SEQUENCE OWNED BY; Schema: se_project; Owner: postgres
--

ALTER SEQUENCE se_project.zones_id_seq OWNED BY se_project.zones.id;


--
-- TOC entry 3242 (class 2604 OID 33392)
-- Name: refund_requests id; Type: DEFAULT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.refund_requests ALTER COLUMN id SET DEFAULT nextval('se_project.refund_requests_id_seq'::regclass);


--
-- TOC entry 3240 (class 2604 OID 33359)
-- Name: rides id; Type: DEFAULT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.rides ALTER COLUMN id SET DEFAULT nextval('se_project.rides_id_seq'::regclass);


--
-- TOC entry 3236 (class 2604 OID 33303)
-- Name: roles id; Type: DEFAULT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.roles ALTER COLUMN id SET DEFAULT nextval('se_project.roles_id_seq'::regclass);


--
-- TOC entry 3245 (class 2604 OID 33434)
-- Name: routes id; Type: DEFAULT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.routes ALTER COLUMN id SET DEFAULT nextval('se_project.routes_id_seq'::regclass);


--
-- TOC entry 3243 (class 2604 OID 33411)
-- Name: senior_requests id; Type: DEFAULT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.senior_requests ALTER COLUMN id SET DEFAULT nextval('se_project.senior_requests_id_seq'::regclass);


--
-- TOC entry 3235 (class 2604 OID 33294)
-- Name: sessions id; Type: DEFAULT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.sessions ALTER COLUMN id SET DEFAULT nextval('se_project.sessions_id_seq'::regclass);


--
-- TOC entry 3246 (class 2604 OID 33453)
-- Name: stationRoutes id; Type: DEFAULT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project."stationRoutes" ALTER COLUMN id SET DEFAULT nextval('se_project.stationroutes_id_seq'::regclass);


--
-- TOC entry 3244 (class 2604 OID 33425)
-- Name: stations id; Type: DEFAULT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.stations ALTER COLUMN id SET DEFAULT nextval('se_project.stations_id_seq'::regclass);


--
-- TOC entry 3238 (class 2604 OID 33321)
-- Name: subsription id; Type: DEFAULT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.subsription ALTER COLUMN id SET DEFAULT nextval('se_project.subsription_id_seq'::regclass);


--
-- TOC entry 3239 (class 2604 OID 33340)
-- Name: tickets id; Type: DEFAULT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.tickets ALTER COLUMN id SET DEFAULT nextval('se_project.tickets_id_seq'::regclass);


--
-- TOC entry 3241 (class 2604 OID 33378)
-- Name: transactions id; Type: DEFAULT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.transactions ALTER COLUMN id SET DEFAULT nextval('se_project.transactions_id_seq'::regclass);


--
-- TOC entry 3234 (class 2604 OID 33285)
-- Name: users id; Type: DEFAULT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.users ALTER COLUMN id SET DEFAULT nextval('se_project.users_id_seq'::regclass);


--
-- TOC entry 3237 (class 2604 OID 33312)
-- Name: zones id; Type: DEFAULT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.zones ALTER COLUMN id SET DEFAULT nextval('se_project.zones_id_seq'::regclass);


--
-- TOC entry 3446 (class 0 OID 33389)
-- Dependencies: 232
-- Data for Name: refund_requests; Type: TABLE DATA; Schema: se_project; Owner: postgres
--

COPY se_project.refund_requests (id, status, "userId", "refundAmount", "ticketId") FROM stdin;
1	accepted	7	0	3
2	rejected	7	0	4
3	pending	7	0	35
\.


--
-- TOC entry 3442 (class 0 OID 33356)
-- Dependencies: 228
-- Data for Name: rides; Type: TABLE DATA; Schema: se_project; Owner: postgres
--

COPY se_project.rides (id, status, origin, destination, "userId", "ticketId", "tripDate") FROM stdin;
1	completed	s1	s3	7	1	2023-06-09 00:00:00
2	completed	s1	s3	7	2	2023-06-09 00:00:00
3	completed	s1	s3	7	3	2023-06-17 00:00:00
5	completed	s1	s3	7	5	2023-06-10 19:56:00
7	completed	s1	s2	7	7	2023-06-16 00:00:00
6	completed	s1	s2	7	6	2023-06-10 19:34:00
8	upcoming	s4	s6	7	8	2023-06-24 21:47:00
9	upcoming	s4	s6	7	9	2023-06-24 21:47:00
4	upcoming	s1	sss222	7	4	2023-06-09 20:26:00
10	completed	s4	sss222	7	10	2023-06-24 21:57:00
11	completed	s4	sss222	7	11	2023-06-24 21:57:00
12	completed	s4	sss222	7	12	2023-06-24 21:57:00
13	completed	s4	sss222	7	13	2023-06-24 21:57:00
14	completed	s4	sss222	7	14	2023-06-24 21:57:00
15	completed	s4	sss222	7	15	2023-06-24 21:57:00
16	completed	s4	sss222	7	16	2023-06-24 21:57:00
17	completed	s4	sss222	7	17	2023-06-24 21:57:00
18	completed	s4	sss222	7	18	2023-06-24 21:57:00
19	completed	s4	sss222	7	19	2023-06-24 21:57:00
20	completed	s4	sss222	7	20	2023-06-24 21:57:00
21	completed	s4	sss222	7	21	2023-06-24 21:57:00
22	completed	s4	sss222	7	22	2023-06-24 21:57:00
23	completed	s4	sss222	7	23	2023-06-24 21:57:00
24	completed	s4	sss222	7	24	2023-06-24 21:57:00
25	completed	s4	sss222	7	25	2023-06-24 21:57:00
26	completed	s4	sss222	7	26	2023-06-24 21:57:00
27	completed	s4	sss222	7	27	2023-06-24 21:57:00
28	completed	s4	sss222	7	28	2023-06-24 21:57:00
29	completed	s4	sss222	7	29	2023-06-24 21:57:00
30	completed	s4	sss222	7	30	2023-06-24 21:57:00
31	completed	s4	sss222	7	31	2023-06-24 21:57:00
32	completed	s4	sss222	7	32	2023-06-24 21:57:00
33	completed	s4	sss222	7	33	2023-06-24 21:57:00
34	completed	s4	sss222	7	34	2023-06-24 21:57:00
35	completed	s4	sss222	7	35	2023-06-24 21:57:00
36	completed	s4	sss222	7	36	2023-06-24 21:57:00
37	completed	s4	sss222	7	37	2023-06-24 21:57:00
\.


--
-- TOC entry 3434 (class 0 OID 33300)
-- Dependencies: 220
-- Data for Name: roles; Type: TABLE DATA; Schema: se_project; Owner: postgres
--

COPY se_project.roles (id, role) FROM stdin;
1	user
2	admin
3	senior
\.


--
-- TOC entry 3452 (class 0 OID 33431)
-- Dependencies: 238
-- Data for Name: routes; Type: TABLE DATA; Schema: se_project; Owner: postgres
--

COPY se_project.routes (id, "routeName", "fromStationId", "toStationId") FROM stdin;
8	s64	6	4
9	r46	4	6
27	p	3	9
28		7	9
29	p	9	7
30		6	9
31	p	9	6
32		6	7
33	p	7	6
5	s42	4	2
7	r14	9	4
26	r13	9	3
\.


--
-- TOC entry 3448 (class 0 OID 33408)
-- Dependencies: 234
-- Data for Name: senior_requests; Type: TABLE DATA; Schema: se_project; Owner: postgres
--

COPY se_project.senior_requests (id, status, "userId", "nationalId") FROM stdin;
1	accepted	7	123
\.


--
-- TOC entry 3432 (class 0 OID 33291)
-- Dependencies: 218
-- Data for Name: sessions; Type: TABLE DATA; Schema: se_project; Owner: postgres
--

COPY se_project.sessions (id, "userId", token, "expiresAt") FROM stdin;
1	3	378b8358-1bef-48ba-bc60-fa0854d86046	2023-06-09 16:56:21.826
2	6	ead0c6fb-49bd-4405-895f-0f80cb7d317f	2023-06-09 16:57:13.742
3	6	8c2e2f7f-0382-4e3f-b544-36fb144725e1	2023-06-09 17:12:44.071
4	7	65f8748a-79da-4b5b-bc86-9b57ca0c2a37	2023-06-09 17:18:29.136
5	7	73a11b15-8d13-4cf0-8e10-f866e0f5dfa4	2023-06-09 17:25:10.923
6	7	9f1ab7a0-d008-44ae-9993-cfb18bb98bd1	2023-06-09 17:40:31.831
7	7	ccfcff50-3520-4886-8ae3-52f22ef20124	2023-06-09 17:55:35.147
8	7	b636d924-5491-401d-bdd7-4c4c9af95e6c	2023-06-09 18:10:48.709
9	7	d8ff9f38-e872-4c70-9ccd-dfdaed6c706e	2023-06-09 18:26:35.222
10	7	415bc4df-0e40-4da5-b998-349dd6fbf42c	2023-06-09 18:41:50.68
11	7	16ce987d-091b-44dd-a647-b715be310d83	2023-06-09 18:57:02.257
12	7	9e0ddbe4-0dc2-4b03-88e8-07c6cf44013f	2023-06-09 19:12:08.815
13	7	39ba106c-42f1-45dd-a838-3cf17185d747	2023-06-09 19:27:24.165
14	6	5b1da08a-5813-4b74-9942-e1dc08324053	2023-06-09 19:28:54.328
15	6	8eef9b0e-fb78-4004-93a8-fa4fc82a4f74	2023-06-09 19:44:02.573
16	6	39e7359b-a199-4b7f-b8e3-7278eabffe2c	2023-06-09 20:04:47.737
17	6	26835f0c-7cdb-432f-8c07-7a702b318952	2023-06-09 20:19:52.062
18	6	41c91f72-cbc5-42ad-8994-fba75a98072c	2023-06-09 20:36:11.341
19	7	957012cc-ca6c-44cb-8134-f28cb0e42c11	2023-06-09 20:37:54.461
20	7	d50f920a-9871-4f98-af91-cab1d02ca9e4	2023-06-09 20:56:06.135
21	6	8c85591e-0bed-40ea-8d36-06145bc08115	2023-06-09 21:11:21.297
22	7	90deddb4-272e-492d-a731-76c15a3392f0	2023-06-09 21:11:59.209
\.


--
-- TOC entry 3454 (class 0 OID 33450)
-- Dependencies: 240
-- Data for Name: stationRoutes; Type: TABLE DATA; Schema: se_project; Owner: postgres
--

COPY se_project."stationRoutes" (id, "stationId", "routeId") FROM stdin;
9	4	5
11	2	5
13	9	7
14	4	7
15	6	8
16	4	8
17	4	9
18	6	9
51	9	26
52	9	27
53	3	26
54	3	27
55	7	28
56	7	29
57	9	28
58	9	29
59	6	30
60	6	31
61	9	30
62	9	31
63	6	32
64	6	33
65	7	32
66	7	33
\.


--
-- TOC entry 3450 (class 0 OID 33422)
-- Dependencies: 236
-- Data for Name: stations; Type: TABLE DATA; Schema: se_project; Owner: postgres
--

COPY se_project.stations (id, "stationName", "stationType", "stationPosition", "stationStatus") FROM stdin;
9	s1	normal	middle	old
6	s6	normal	start	old
7	s7	normal	start	old
2	sss222	normal	middle	old
16	dasadsfadgs	normal	\N	new
13	ss4	normal	start	old
10	ss1	normal	\N	old
4	s4	normal	start	old
3	s3	normal	end	old
\.


--
-- TOC entry 3438 (class 0 OID 33318)
-- Dependencies: 224
-- Data for Name: subsription; Type: TABLE DATA; Schema: se_project; Owner: postgres
--

COPY se_project.subsription (id, "subType", "zoneId", "userId", "noOfTickets") FROM stdin;
\.


--
-- TOC entry 3440 (class 0 OID 33337)
-- Dependencies: 226
-- Data for Name: tickets; Type: TABLE DATA; Schema: se_project; Owner: postgres
--

COPY se_project.tickets (id, origin, destination, "userId", "subId", "tripDate") FROM stdin;
1	s1	s3	7	\N	2023-06-09 00:00:00
2	s1	s3	7	\N	2023-06-09 00:00:00
3	s1	s3	7	\N	2023-06-17 00:00:00
4	s1	sss222	7	\N	2023-06-09 20:26:00
5	s1	s3	7	\N	2023-06-10 19:56:00
8	s4	s6	7	\N	2023-06-24 21:47:00
9	s4	s6	7	\N	2023-06-24 21:47:00
6	s1	sss222	7	\N	2023-06-10 19:34:00
7	s1	sss222	7	\N	2023-06-16 00:00:00
10	s4	sss222	7	\N	2023-06-24 21:57:00
11	s4	sss222	7	\N	2023-06-24 21:57:00
12	s4	sss222	7	\N	2023-06-24 21:57:00
13	s4	sss222	7	\N	2023-06-24 21:57:00
14	s4	sss222	7	\N	2023-06-24 21:57:00
15	s4	sss222	7	\N	2023-06-24 21:57:00
16	s4	sss222	7	\N	2023-06-24 21:57:00
17	s4	sss222	7	\N	2023-06-24 21:57:00
18	s4	sss222	7	\N	2023-06-24 21:57:00
19	s4	sss222	7	\N	2023-06-24 21:57:00
20	s4	sss222	7	\N	2023-06-24 21:57:00
21	s4	sss222	7	\N	2023-06-24 21:57:00
22	s4	sss222	7	\N	2023-06-24 21:57:00
23	s4	sss222	7	\N	2023-06-24 21:57:00
24	s4	sss222	7	\N	2023-06-24 21:57:00
25	s4	sss222	7	\N	2023-06-24 21:57:00
26	s4	sss222	7	\N	2023-06-24 21:57:00
27	s4	sss222	7	\N	2023-06-24 21:57:00
28	s4	sss222	7	\N	2023-06-24 21:57:00
29	s4	sss222	7	\N	2023-06-24 21:57:00
30	s4	sss222	7	\N	2023-06-24 21:57:00
31	s4	sss222	7	\N	2023-06-24 21:57:00
32	s4	sss222	7	\N	2023-06-24 21:57:00
33	s4	sss222	7	\N	2023-06-24 21:57:00
34	s4	sss222	7	\N	2023-06-24 21:57:00
35	s4	sss222	7	\N	2023-06-24 21:57:00
36	s4	sss222	7	\N	2023-06-24 21:57:00
37	s4	sss222	7	\N	2023-06-24 21:57:00
\.


--
-- TOC entry 3444 (class 0 OID 33375)
-- Dependencies: 230
-- Data for Name: transactions; Type: TABLE DATA; Schema: se_project; Owner: postgres
--

COPY se_project.transactions (id, amount, "userId", "purchasedId", type) FROM stdin;
1	50	7	1	subscription
2	70	7	2	subscription
3	0	7	1	ticket
4	0	7	2	ticket
5	0	7	3	ticket
6	0	7	4	ticket
7	650	7	3	subscription
8	0	7	5	ticket
9	0	7	6	ticket
10	0	7	7	ticket
11	0	7	3	ticket
12	0	7	8	ticket
13	0	7	9	ticket
14	0	7	10	ticket
15	0	7	11	ticket
16	0	7	12	ticket
17	0	7	13	ticket
18	0	7	14	ticket
19	0	7	15	ticket
20	0	7	16	ticket
21	0	7	17	ticket
22	0	7	18	ticket
23	0	7	19	ticket
24	0	7	20	ticket
25	0	7	21	ticket
26	0	7	22	ticket
27	0	7	23	ticket
28	0	7	24	ticket
29	0	7	25	ticket
30	0	7	26	ticket
31	0	7	27	ticket
32	0	7	28	ticket
33	0	7	29	ticket
34	0	7	30	ticket
35	0	7	31	ticket
36	0	7	32	ticket
37	0	7	33	ticket
38	0	7	34	ticket
39	0	7	35	ticket
40	0	7	36	ticket
41	0	7	37	ticket
\.


--
-- TOC entry 3430 (class 0 OID 33282)
-- Dependencies: 216
-- Data for Name: users; Type: TABLE DATA; Schema: se_project; Owner: postgres
--

COPY se_project.users (id, "firstName", "lastName", email, password, "roleId") FROM stdin;
6	Mostafa	Ramadan	most2be@gmail.com	123	2
7	Omar	Dawoud	darwin@gmail.com	123	3
\.


--
-- TOC entry 3436 (class 0 OID 33309)
-- Dependencies: 222
-- Data for Name: zones; Type: TABLE DATA; Schema: se_project; Owner: postgres
--

COPY se_project.zones (id, "zoneType", price) FROM stdin;
2	10-15	7
3	16+	10
1	1-9	5
\.


--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 231
-- Name: refund_requests_id_seq; Type: SEQUENCE SET; Schema: se_project; Owner: postgres
--

SELECT pg_catalog.setval('se_project.refund_requests_id_seq', 3, true);


--
-- TOC entry 3474 (class 0 OID 0)
-- Dependencies: 227
-- Name: rides_id_seq; Type: SEQUENCE SET; Schema: se_project; Owner: postgres
--

SELECT pg_catalog.setval('se_project.rides_id_seq', 37, true);


--
-- TOC entry 3475 (class 0 OID 0)
-- Dependencies: 219
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: se_project; Owner: postgres
--

SELECT pg_catalog.setval('se_project.roles_id_seq', 3, true);


--
-- TOC entry 3476 (class 0 OID 0)
-- Dependencies: 237
-- Name: routes_id_seq; Type: SEQUENCE SET; Schema: se_project; Owner: postgres
--

SELECT pg_catalog.setval('se_project.routes_id_seq', 33, true);


--
-- TOC entry 3477 (class 0 OID 0)
-- Dependencies: 233
-- Name: senior_requests_id_seq; Type: SEQUENCE SET; Schema: se_project; Owner: postgres
--

SELECT pg_catalog.setval('se_project.senior_requests_id_seq', 1, true);


--
-- TOC entry 3478 (class 0 OID 0)
-- Dependencies: 217
-- Name: sessions_id_seq; Type: SEQUENCE SET; Schema: se_project; Owner: postgres
--

SELECT pg_catalog.setval('se_project.sessions_id_seq', 22, true);


--
-- TOC entry 3479 (class 0 OID 0)
-- Dependencies: 239
-- Name: stationroutes_id_seq; Type: SEQUENCE SET; Schema: se_project; Owner: postgres
--

SELECT pg_catalog.setval('se_project.stationroutes_id_seq', 66, true);


--
-- TOC entry 3480 (class 0 OID 0)
-- Dependencies: 235
-- Name: stations_id_seq; Type: SEQUENCE SET; Schema: se_project; Owner: postgres
--

SELECT pg_catalog.setval('se_project.stations_id_seq', 16, true);


--
-- TOC entry 3481 (class 0 OID 0)
-- Dependencies: 223
-- Name: subsription_id_seq; Type: SEQUENCE SET; Schema: se_project; Owner: postgres
--

SELECT pg_catalog.setval('se_project.subsription_id_seq', 3, true);


--
-- TOC entry 3482 (class 0 OID 0)
-- Dependencies: 225
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: se_project; Owner: postgres
--

SELECT pg_catalog.setval('se_project.tickets_id_seq', 37, true);


--
-- TOC entry 3483 (class 0 OID 0)
-- Dependencies: 229
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: se_project; Owner: postgres
--

SELECT pg_catalog.setval('se_project.transactions_id_seq', 41, true);


--
-- TOC entry 3484 (class 0 OID 0)
-- Dependencies: 215
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: se_project; Owner: postgres
--

SELECT pg_catalog.setval('se_project.users_id_seq', 7, true);


--
-- TOC entry 3485 (class 0 OID 0)
-- Dependencies: 221
-- Name: zones_id_seq; Type: SEQUENCE SET; Schema: se_project; Owner: postgres
--

SELECT pg_catalog.setval('se_project.zones_id_seq', 1, false);


--
-- TOC entry 3264 (class 2606 OID 33396)
-- Name: refund_requests refund_requests_pkey; Type: CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.refund_requests
    ADD CONSTRAINT refund_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 3260 (class 2606 OID 33363)
-- Name: rides rides_pkey; Type: CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.rides
    ADD CONSTRAINT rides_pkey PRIMARY KEY (id);


--
-- TOC entry 3252 (class 2606 OID 33307)
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- TOC entry 3270 (class 2606 OID 33438)
-- Name: routes routes_pkey; Type: CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.routes
    ADD CONSTRAINT routes_pkey PRIMARY KEY (id);


--
-- TOC entry 3266 (class 2606 OID 33415)
-- Name: senior_requests senior_requests_pkey; Type: CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.senior_requests
    ADD CONSTRAINT senior_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 3250 (class 2606 OID 33298)
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- TOC entry 3272 (class 2606 OID 33455)
-- Name: stationRoutes stationroutes_pkey; Type: CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project."stationRoutes"
    ADD CONSTRAINT stationroutes_pkey PRIMARY KEY (id);


--
-- TOC entry 3268 (class 2606 OID 33429)
-- Name: stations stations_pkey; Type: CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.stations
    ADD CONSTRAINT stations_pkey PRIMARY KEY (id);


--
-- TOC entry 3256 (class 2606 OID 33325)
-- Name: subsription subsription_pkey; Type: CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.subsription
    ADD CONSTRAINT subsription_pkey PRIMARY KEY (id);


--
-- TOC entry 3258 (class 2606 OID 33344)
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- TOC entry 3262 (class 2606 OID 33382)
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 3248 (class 2606 OID 33289)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3254 (class 2606 OID 33316)
-- Name: zones zones_pkey; Type: CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.zones
    ADD CONSTRAINT zones_pkey PRIMARY KEY (id);


--
-- TOC entry 3280 (class 2606 OID 33402)
-- Name: refund_requests refund_requests_ticketid_fkey; Type: FK CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.refund_requests
    ADD CONSTRAINT refund_requests_ticketid_fkey FOREIGN KEY ("ticketId") REFERENCES se_project.tickets(id);


--
-- TOC entry 3281 (class 2606 OID 33397)
-- Name: refund_requests refund_requests_userid_fkey; Type: FK CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.refund_requests
    ADD CONSTRAINT refund_requests_userid_fkey FOREIGN KEY ("userId") REFERENCES se_project.users(id);


--
-- TOC entry 3277 (class 2606 OID 33369)
-- Name: rides rides_ticketid_fkey; Type: FK CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.rides
    ADD CONSTRAINT rides_ticketid_fkey FOREIGN KEY ("ticketId") REFERENCES se_project.tickets(id);


--
-- TOC entry 3278 (class 2606 OID 33364)
-- Name: rides rides_userid_fkey; Type: FK CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.rides
    ADD CONSTRAINT rides_userid_fkey FOREIGN KEY ("userId") REFERENCES se_project.users(id);


--
-- TOC entry 3283 (class 2606 OID 33439)
-- Name: routes routes_fromstationid_fkey; Type: FK CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.routes
    ADD CONSTRAINT routes_fromstationid_fkey FOREIGN KEY ("fromStationId") REFERENCES se_project.stations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3284 (class 2606 OID 33444)
-- Name: routes routes_tostationid_fkey; Type: FK CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.routes
    ADD CONSTRAINT routes_tostationid_fkey FOREIGN KEY ("toStationId") REFERENCES se_project.stations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3282 (class 2606 OID 33416)
-- Name: senior_requests senior_requests_userid_fkey; Type: FK CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.senior_requests
    ADD CONSTRAINT senior_requests_userid_fkey FOREIGN KEY ("userId") REFERENCES se_project.users(id);


--
-- TOC entry 3285 (class 2606 OID 33461)
-- Name: stationRoutes stationroutes_routeid_fkey; Type: FK CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project."stationRoutes"
    ADD CONSTRAINT stationroutes_routeid_fkey FOREIGN KEY ("routeId") REFERENCES se_project.routes(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3286 (class 2606 OID 33456)
-- Name: stationRoutes stationroutes_stationid_fkey; Type: FK CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project."stationRoutes"
    ADD CONSTRAINT stationroutes_stationid_fkey FOREIGN KEY ("stationId") REFERENCES se_project.stations(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 3273 (class 2606 OID 33326)
-- Name: subsription subsription_userid_fkey; Type: FK CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.subsription
    ADD CONSTRAINT subsription_userid_fkey FOREIGN KEY ("userId") REFERENCES se_project.users(id);


--
-- TOC entry 3274 (class 2606 OID 33331)
-- Name: subsription subsription_zoneid_fkey; Type: FK CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.subsription
    ADD CONSTRAINT subsription_zoneid_fkey FOREIGN KEY ("zoneId") REFERENCES se_project.zones(id);


--
-- TOC entry 3275 (class 2606 OID 33350)
-- Name: tickets tickets_subid_fkey; Type: FK CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.tickets
    ADD CONSTRAINT tickets_subid_fkey FOREIGN KEY ("subId") REFERENCES se_project.subsription(id);


--
-- TOC entry 3276 (class 2606 OID 33345)
-- Name: tickets tickets_userid_fkey; Type: FK CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.tickets
    ADD CONSTRAINT tickets_userid_fkey FOREIGN KEY ("userId") REFERENCES se_project.users(id);


--
-- TOC entry 3279 (class 2606 OID 33383)
-- Name: transactions transactions_userid_fkey; Type: FK CONSTRAINT; Schema: se_project; Owner: postgres
--

ALTER TABLE ONLY se_project.transactions
    ADD CONSTRAINT transactions_userid_fkey FOREIGN KEY ("userId") REFERENCES se_project.users(id);


-- Completed on 2023-06-09 22:37:18

--
-- PostgreSQL database dump complete
--

