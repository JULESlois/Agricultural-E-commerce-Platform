--
-- PostgreSQL database dump
--

\restrict tRPtXedoBsgBpJd7ATeA27XeYkGWH9aWP5TOzJR3DfgoesUPwAgDbBtjndd9F43

-- Dumped from database version 18.0
-- Dumped by pg_dump version 18.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE ONLY public.sys_user_farmer DROP CONSTRAINT sys_user_farmer_user_id_fkey;
ALTER TABLE ONLY public.sys_user_buyer DROP CONSTRAINT sys_user_buyer_user_id_fkey;
ALTER TABLE ONLY public.sys_user_buyer DROP CONSTRAINT sys_user_buyer_default_address_id_fkey;
ALTER TABLE ONLY public.sys_user_address DROP CONSTRAINT sys_user_address_user_id_fkey;
ALTER TABLE ONLY public.mall_user_coupon DROP CONSTRAINT mall_user_coupon_user_id_fkey;
ALTER TABLE ONLY public.mall_user_coupon DROP CONSTRAINT mall_user_coupon_rule_id_fkey;
ALTER TABLE ONLY public.mall_supply_demand_match DROP CONSTRAINT mall_supply_demand_match_source_id_fkey;
ALTER TABLE ONLY public.mall_supply_demand_match DROP CONSTRAINT mall_supply_demand_match_seller_id_fkey;
ALTER TABLE ONLY public.mall_supply_demand_match DROP CONSTRAINT mall_supply_demand_match_demand_id_fkey;
ALTER TABLE ONLY public.mall_supply_demand_match DROP CONSTRAINT mall_supply_demand_match_buyer_id_fkey;
ALTER TABLE ONLY public.mall_order_main DROP CONSTRAINT mall_order_main_source_id_fkey;
ALTER TABLE ONLY public.mall_order_main DROP CONSTRAINT mall_order_main_seller_id_fkey;
ALTER TABLE ONLY public.mall_order_main DROP CONSTRAINT mall_order_main_receiver_address_id_fkey;
ALTER TABLE ONLY public.mall_order_main DROP CONSTRAINT mall_order_main_match_id_fkey;
ALTER TABLE ONLY public.mall_order_main DROP CONSTRAINT mall_order_main_demand_id_fkey;
ALTER TABLE ONLY public.mall_order_main DROP CONSTRAINT mall_order_main_buyer_id_fkey;
ALTER TABLE ONLY public.mall_farmer_source DROP CONSTRAINT mall_farmer_source_user_id_fkey;
ALTER TABLE ONLY public.mall_farmer_source DROP CONSTRAINT mall_farmer_source_category_id_fkey;
ALTER TABLE ONLY public.mall_farmer_source DROP CONSTRAINT mall_farmer_source_audit_user_fkey;
ALTER TABLE ONLY public.mall_discount_activity DROP CONSTRAINT mall_discount_activity_create_user_fkey;
ALTER TABLE ONLY public.mall_coupon_rule DROP CONSTRAINT mall_coupon_rule_create_user_fkey;
ALTER TABLE ONLY public.mall_buyer_demand DROP CONSTRAINT mall_buyer_demand_user_id_fkey;
ALTER TABLE ONLY public.mall_buyer_demand DROP CONSTRAINT mall_buyer_demand_delivery_address_id_fkey;
ALTER TABLE ONLY public.mall_buyer_demand DROP CONSTRAINT mall_buyer_demand_category_id_fkey;
ALTER TABLE ONLY public.mall_operation_log DROP CONSTRAINT fk_user;
ALTER TABLE ONLY public.mall_user_collection DROP CONSTRAINT fk_user;
ALTER TABLE ONLY public.mall_user_follow DROP CONSTRAINT fk_user;
ALTER TABLE ONLY public.mall_user_footprint DROP CONSTRAINT fk_user;
ALTER TABLE ONLY public.sys_user_cert_apply DROP CONSTRAINT fk_user;
ALTER TABLE ONLY public.sys_user_cert_material DROP CONSTRAINT fk_upload_user;
ALTER TABLE ONLY public.financing_presale_subscription DROP CONSTRAINT fk_subscription_user;
ALTER TABLE ONLY public.financing_presale_subscription DROP CONSTRAINT fk_subscription_plan;
ALTER TABLE ONLY public.mall_user_collection DROP CONSTRAINT fk_source;
ALTER TABLE ONLY public.mall_order_item DROP CONSTRAINT fk_source;
ALTER TABLE ONLY public.mall_user_follow DROP CONSTRAINT fk_seller;
ALTER TABLE ONLY public.sys_user_cert_material DROP CONSTRAINT fk_replace_material;
ALTER TABLE ONLY public.financing_presale_plan DROP CONSTRAINT fk_presale_plan_user;
ALTER TABLE ONLY public.financing_presale_plan DROP CONSTRAINT fk_presale_plan_category;
ALTER TABLE ONLY public.mall_order_aftersale DROP CONSTRAINT fk_order;
ALTER TABLE ONLY public.mall_order_item DROP CONSTRAINT fk_order;
ALTER TABLE ONLY public.mall_order_invoice DROP CONSTRAINT fk_order;
ALTER TABLE ONLY public.mall_order_aftersale DROP CONSTRAINT fk_item;
ALTER TABLE ONLY public.mall_user_collection DROP CONSTRAINT fk_demand;
ALTER TABLE ONLY public.mall_order_invoice DROP CONSTRAINT fk_create_user;
ALTER TABLE ONLY public.sys_cert_type DROP CONSTRAINT fk_create_user;
ALTER TABLE ONLY public.sys_user_cert_apply DROP CONSTRAINT fk_cert_type;
ALTER TABLE ONLY public.mall_product_price_stat DROP CONSTRAINT fk_category;
ALTER TABLE ONLY public.mall_shopping_cart DROP CONSTRAINT fk_cart_user;
ALTER TABLE ONLY public.mall_shopping_cart DROP CONSTRAINT fk_cart_source;
ALTER TABLE ONLY public.mall_order_invoice DROP CONSTRAINT fk_buyer;
ALTER TABLE ONLY public.mall_order_aftersale DROP CONSTRAINT fk_audit_user;
ALTER TABLE ONLY public.sys_user_cert_apply DROP CONSTRAINT fk_audit_user;
ALTER TABLE ONLY public.mall_order_aftersale DROP CONSTRAINT fk_apply_user;
ALTER TABLE ONLY public.sys_user_cert_material DROP CONSTRAINT fk_apply;
DROP TRIGGER update_sys_user_modtime ON public.sys_user;
DROP TRIGGER update_sys_user_farmer_modtime ON public.sys_user_farmer;
DROP TRIGGER update_sys_user_cert_apply_updated_at ON public.sys_user_cert_apply;
DROP TRIGGER update_sys_user_buyer_modtime ON public.sys_user_buyer;
DROP TRIGGER update_sys_user_address_modtime ON public.sys_user_address;
DROP TRIGGER update_sys_cert_type_updated_at ON public.sys_cert_type;
DROP TRIGGER update_qa_updated_at ON public.community_qa_relation;
DROP TRIGGER update_mall_supply_demand_match_modtime ON public.mall_supply_demand_match;
DROP TRIGGER update_mall_product_category_modtime ON public.mall_product_category;
DROP TRIGGER update_mall_order_main_modtime ON public.mall_order_main;
DROP TRIGGER update_mall_order_item_updated_at ON public.mall_order_item;
DROP TRIGGER update_mall_order_invoice_updated_at ON public.mall_order_invoice;
DROP TRIGGER update_mall_order_aftersale_updated_at ON public.mall_order_aftersale;
DROP TRIGGER update_mall_farmer_source_modtime ON public.mall_farmer_source;
DROP TRIGGER update_mall_discount_activity_modtime ON public.mall_discount_activity;
DROP TRIGGER update_mall_coupon_rule_modtime ON public.mall_coupon_rule;
DROP TRIGGER update_mall_buyer_demand_modtime ON public.mall_buyer_demand;
DROP TRIGGER update_content_updated_at ON public.community_content;
DROP TRIGGER update_categories_updated_at ON public.community_categories;
DROP INDEX public.idx_violations_violator;
DROP INDEX public.idx_violations_report;
DROP INDEX public.idx_task_name;
DROP INDEX public.idx_tags_enabled;
DROP INDEX public.idx_subscription_user_id;
DROP INDEX public.idx_subscription_plan_id;
DROP INDEX public.idx_status;
DROP INDEX public.idx_start_time;
DROP INDEX public.idx_reports_type_obj;
DROP INDEX public.idx_reports_reporter;
DROP INDEX public.idx_reports_audit_status;
DROP INDEX public.idx_region;
DROP INDEX public.idx_qa_status;
DROP INDEX public.idx_product_name;
DROP INDEX public.idx_presale_plan_user_id;
DROP INDEX public.idx_presale_plan_status;
DROP INDEX public.idx_prediction_date;
DROP INDEX public.idx_likes_user;
DROP INDEX public.idx_historical_product;
DROP INDEX public.idx_historical_date;
DROP INDEX public.idx_forecast_region;
DROP INDEX public.idx_forecast_product;
DROP INDEX public.idx_forecast_prediction_date;
DROP INDEX public.idx_forecast_date;
DROP INDEX public.idx_follows_follower;
DROP INDEX public.idx_follows_followed;
DROP INDEX public.idx_created_at;
DROP INDEX public.idx_content_type;
DROP INDEX public.idx_content_tags_tag;
DROP INDEX public.idx_content_create_time;
DROP INDEX public.idx_content_category;
DROP INDEX public.idx_content_author;
DROP INDEX public.idx_content_audit;
DROP INDEX public.idx_comments_parent;
DROP INDEX public.idx_comments_content;
DROP INDEX public.idx_comments_commenter;
DROP INDEX public.idx_collects_user;
DROP INDEX public.idx_categories_parent;
DROP INDEX public.idx_categories_enabled;
DROP INDEX public.idx_cart_user_id;
DROP INDEX public.idx_cart_source_id;
DROP INDEX public.idx_blacklist_blocker;
ALTER TABLE ONLY public.mall_shopping_cart DROP CONSTRAINT unique_user_source;
ALTER TABLE ONLY public.community_tags DROP CONSTRAINT uk_tag_name;
ALTER TABLE ONLY public.financing_credit_evaluation DROP CONSTRAINT uk_rve9ust259lf4omndr4nu6mob;
ALTER TABLE ONLY public.community_reports DROP CONSTRAINT uk_report_no;
ALTER TABLE ONLY public.community_qa_relation DROP CONSTRAINT uk_qa_content;
ALTER TABLE ONLY public.financing_bank DROP CONSTRAINT uk_lt95tuqqedce59kv9d29rsky2;
ALTER TABLE ONLY public.community_likes DROP CONSTRAINT uk_likes_content_user;
ALTER TABLE ONLY public.financing_bank_approval DROP CONSTRAINT uk_gfa4h9lnwckn5egp2pgr96ftk;
ALTER TABLE ONLY public.community_follows DROP CONSTRAINT uk_follower_followed;
ALTER TABLE ONLY public.financing_loan_type DROP CONSTRAINT uk_f6m7mlo513jx72y4uvrs0uw8y;
ALTER TABLE ONLY public.community_content_tags DROP CONSTRAINT uk_content_tag;
ALTER TABLE ONLY public.community_collects DROP CONSTRAINT uk_collects_content_user;
ALTER TABLE ONLY public.community_blacklist DROP CONSTRAINT uk_blocker_blacked;
ALTER TABLE ONLY public.sys_user_cert_material DROP CONSTRAINT uk_apply_material;
ALTER TABLE ONLY public.financing_bank DROP CONSTRAINT uk_3gs7k2ppjkvjvmg3q16r587ku;
ALTER TABLE ONLY public.financing_application DROP CONSTRAINT uk_30md8gcu4qvuekxi4sv80fj9b;
ALTER TABLE ONLY public.sys_user DROP CONSTRAINT sys_user_user_name_key;
ALTER TABLE ONLY public.sys_user DROP CONSTRAINT sys_user_pkey;
ALTER TABLE ONLY public.sys_user DROP CONSTRAINT sys_user_phone_key;
ALTER TABLE ONLY public.sys_user DROP CONSTRAINT sys_user_id_card_key;
ALTER TABLE ONLY public.sys_user_farmer DROP CONSTRAINT sys_user_farmer_user_id_key;
ALTER TABLE ONLY public.sys_user_farmer DROP CONSTRAINT sys_user_farmer_pkey;
ALTER TABLE ONLY public.sys_user_farmer DROP CONSTRAINT sys_user_farmer_bank_card_no_key;
ALTER TABLE ONLY public.sys_user DROP CONSTRAINT sys_user_email_key;
ALTER TABLE ONLY public.sys_user_cert_material DROP CONSTRAINT sys_user_cert_material_pkey;
ALTER TABLE ONLY public.sys_user_cert_apply DROP CONSTRAINT sys_user_cert_apply_pkey;
ALTER TABLE ONLY public.sys_user_cert_apply DROP CONSTRAINT sys_user_cert_apply_apply_no_key;
ALTER TABLE ONLY public.sys_user_buyer DROP CONSTRAINT sys_user_buyer_user_id_key;
ALTER TABLE ONLY public.sys_user_buyer DROP CONSTRAINT sys_user_buyer_taxpayer_id_key;
ALTER TABLE ONLY public.sys_user_buyer DROP CONSTRAINT sys_user_buyer_pkey;
ALTER TABLE ONLY public.sys_user_address DROP CONSTRAINT sys_user_address_pkey;
ALTER TABLE ONLY public.sys_cert_type DROP CONSTRAINT sys_cert_type_pkey;
ALTER TABLE ONLY public.sys_cert_type DROP CONSTRAINT sys_cert_type_cert_type_name_key;
ALTER TABLE ONLY public.sys_cert_type DROP CONSTRAINT sys_cert_type_cert_type_code_key;
ALTER TABLE ONLY public.price_predictions DROP CONSTRAINT price_predictions_product_name_region_prediction_type_predi_key;
ALTER TABLE ONLY public.price_predictions DROP CONSTRAINT price_predictions_pkey;
ALTER TABLE ONLY public.price_forecasts DROP CONSTRAINT price_forecasts_pkey;
ALTER TABLE ONLY public.prediction_logs DROP CONSTRAINT prediction_logs_pkey;
ALTER TABLE ONLY public.mall_user_footprint DROP CONSTRAINT mall_user_footprint_pkey;
ALTER TABLE ONLY public.mall_user_follow DROP CONSTRAINT mall_user_follow_pkey;
ALTER TABLE ONLY public.mall_user_coupon DROP CONSTRAINT mall_user_coupon_pkey;
ALTER TABLE ONLY public.mall_user_coupon DROP CONSTRAINT mall_user_coupon_coupon_no_key;
ALTER TABLE ONLY public.mall_user_collection DROP CONSTRAINT mall_user_collection_pkey;
ALTER TABLE ONLY public.mall_supply_demand_match DROP CONSTRAINT mall_supply_demand_match_pkey;
ALTER TABLE ONLY public.mall_supply_demand_match DROP CONSTRAINT mall_supply_demand_match_match_no_key;
ALTER TABLE ONLY public.mall_shopping_cart DROP CONSTRAINT mall_shopping_cart_pkey;
ALTER TABLE ONLY public.mall_product_price_stat DROP CONSTRAINT mall_product_price_stat_pkey;
ALTER TABLE ONLY public.mall_product_category DROP CONSTRAINT mall_product_category_pkey;
ALTER TABLE ONLY public.mall_product_category DROP CONSTRAINT mall_product_category_category_code_key;
ALTER TABLE ONLY public.mall_order_main DROP CONSTRAINT mall_order_main_pkey;
ALTER TABLE ONLY public.mall_order_item DROP CONSTRAINT mall_order_item_pkey;
ALTER TABLE ONLY public.mall_order_item DROP CONSTRAINT mall_order_item_item_no_key;
ALTER TABLE ONLY public.mall_order_invoice DROP CONSTRAINT mall_order_invoice_pkey;
ALTER TABLE ONLY public.mall_order_invoice DROP CONSTRAINT mall_order_invoice_order_id_key;
ALTER TABLE ONLY public.mall_order_invoice DROP CONSTRAINT mall_order_invoice_invoice_no_key;
ALTER TABLE ONLY public.mall_order_aftersale DROP CONSTRAINT mall_order_aftersale_pkey;
ALTER TABLE ONLY public.mall_order_aftersale DROP CONSTRAINT mall_order_aftersale_order_id_key;
ALTER TABLE ONLY public.mall_operation_log DROP CONSTRAINT mall_operation_log_pkey;
ALTER TABLE ONLY public.mall_farmer_source DROP CONSTRAINT mall_farmer_source_source_no_key;
ALTER TABLE ONLY public.mall_farmer_source DROP CONSTRAINT mall_farmer_source_pkey;
ALTER TABLE ONLY public.mall_discount_activity DROP CONSTRAINT mall_discount_activity_pkey;
ALTER TABLE ONLY public.mall_discount_activity DROP CONSTRAINT mall_discount_activity_activity_no_key;
ALTER TABLE ONLY public.mall_coupon_rule DROP CONSTRAINT mall_coupon_rule_pkey;
ALTER TABLE ONLY public.mall_buyer_demand DROP CONSTRAINT mall_buyer_demand_pkey;
ALTER TABLE ONLY public.mall_buyer_demand DROP CONSTRAINT mall_buyer_demand_demand_no_key;
ALTER TABLE ONLY public.historical_prices DROP CONSTRAINT historical_prices_pkey;
ALTER TABLE ONLY public.forecast_job_logs DROP CONSTRAINT forecast_job_logs_pkey;
ALTER TABLE ONLY public.financing_repayment_schedule DROP CONSTRAINT financing_repayment_schedule_pkey;
ALTER TABLE ONLY public.financing_repayment_adjustment_request DROP CONSTRAINT financing_repayment_adjustment_request_pkey;
ALTER TABLE ONLY public.financing_presale_subscription DROP CONSTRAINT financing_presale_subscription_subscription_no_key;
ALTER TABLE ONLY public.financing_presale_subscription DROP CONSTRAINT financing_presale_subscription_pkey;
ALTER TABLE ONLY public.financing_presale_plan DROP CONSTRAINT financing_presale_plan_plan_no_key;
ALTER TABLE ONLY public.financing_presale_plan DROP CONSTRAINT financing_presale_plan_pkey;
ALTER TABLE ONLY public.financing_loan_type DROP CONSTRAINT financing_loan_type_pkey;
ALTER TABLE ONLY public.financing_credit_evaluation DROP CONSTRAINT financing_credit_evaluation_pkey;
ALTER TABLE ONLY public.financing_bank DROP CONSTRAINT financing_bank_pkey;
ALTER TABLE ONLY public.financing_bank_approval DROP CONSTRAINT financing_bank_approval_pkey;
ALTER TABLE ONLY public.financing_application DROP CONSTRAINT financing_application_pkey;
ALTER TABLE ONLY public.community_violations DROP CONSTRAINT community_violations_pkey;
ALTER TABLE ONLY public.community_tags DROP CONSTRAINT community_tags_pkey;
ALTER TABLE ONLY public.community_reports DROP CONSTRAINT community_reports_pkey;
ALTER TABLE ONLY public.community_qa_relation DROP CONSTRAINT community_qa_relation_pkey;
ALTER TABLE ONLY public.community_likes DROP CONSTRAINT community_likes_pkey;
ALTER TABLE ONLY public.community_follows DROP CONSTRAINT community_follows_pkey;
ALTER TABLE ONLY public.community_content_tags DROP CONSTRAINT community_content_tags_pkey;
ALTER TABLE ONLY public.community_content DROP CONSTRAINT community_content_pkey;
ALTER TABLE ONLY public.community_comments DROP CONSTRAINT community_comments_pkey;
ALTER TABLE ONLY public.community_collects DROP CONSTRAINT community_collects_pkey;
ALTER TABLE ONLY public.community_categories DROP CONSTRAINT community_categories_pkey;
ALTER TABLE ONLY public.community_blacklist DROP CONSTRAINT community_blacklist_pkey;
ALTER TABLE public.sys_user_farmer ALTER COLUMN farmer_id DROP DEFAULT;
ALTER TABLE public.sys_user_cert_material ALTER COLUMN material_id DROP DEFAULT;
ALTER TABLE public.sys_user_cert_apply ALTER COLUMN apply_id DROP DEFAULT;
ALTER TABLE public.sys_user_buyer ALTER COLUMN buyer_id DROP DEFAULT;
ALTER TABLE public.sys_user_address ALTER COLUMN address_id DROP DEFAULT;
ALTER TABLE public.sys_user ALTER COLUMN user_id DROP DEFAULT;
ALTER TABLE public.sys_cert_type ALTER COLUMN cert_type_id DROP DEFAULT;
ALTER TABLE public.price_predictions ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.price_forecasts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.prediction_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.mall_user_footprint ALTER COLUMN footprint_id DROP DEFAULT;
ALTER TABLE public.mall_user_follow ALTER COLUMN follow_id DROP DEFAULT;
ALTER TABLE public.mall_user_coupon ALTER COLUMN user_coupon_id DROP DEFAULT;
ALTER TABLE public.mall_user_collection ALTER COLUMN collection_id DROP DEFAULT;
ALTER TABLE public.mall_supply_demand_match ALTER COLUMN match_id DROP DEFAULT;
ALTER TABLE public.mall_shopping_cart ALTER COLUMN cart_id DROP DEFAULT;
ALTER TABLE public.mall_product_price_stat ALTER COLUMN stat_id DROP DEFAULT;
ALTER TABLE public.mall_product_category ALTER COLUMN category_id DROP DEFAULT;
ALTER TABLE public.mall_order_item ALTER COLUMN item_id DROP DEFAULT;
ALTER TABLE public.mall_order_invoice ALTER COLUMN invoice_id DROP DEFAULT;
ALTER TABLE public.mall_order_aftersale ALTER COLUMN aftersale_id DROP DEFAULT;
ALTER TABLE public.mall_operation_log ALTER COLUMN log_id DROP DEFAULT;
ALTER TABLE public.mall_farmer_source ALTER COLUMN source_id DROP DEFAULT;
ALTER TABLE public.mall_discount_activity ALTER COLUMN activity_id DROP DEFAULT;
ALTER TABLE public.mall_coupon_rule ALTER COLUMN rule_id DROP DEFAULT;
ALTER TABLE public.mall_buyer_demand ALTER COLUMN demand_id DROP DEFAULT;
ALTER TABLE public.historical_prices ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.forecast_job_logs ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.financing_repayment_schedule ALTER COLUMN schedule_id DROP DEFAULT;
ALTER TABLE public.financing_repayment_adjustment_request ALTER COLUMN request_id DROP DEFAULT;
ALTER TABLE public.financing_presale_subscription ALTER COLUMN subscription_id DROP DEFAULT;
ALTER TABLE public.financing_presale_plan ALTER COLUMN plan_id DROP DEFAULT;
ALTER TABLE public.financing_loan_type ALTER COLUMN loan_type_id DROP DEFAULT;
ALTER TABLE public.financing_credit_evaluation ALTER COLUMN evaluation_id DROP DEFAULT;
ALTER TABLE public.financing_bank_approval ALTER COLUMN approval_id DROP DEFAULT;
ALTER TABLE public.financing_bank ALTER COLUMN bank_id DROP DEFAULT;
ALTER TABLE public.financing_application ALTER COLUMN application_id DROP DEFAULT;
ALTER TABLE public.community_violations ALTER COLUMN violation_id DROP DEFAULT;
ALTER TABLE public.community_tags ALTER COLUMN tag_id DROP DEFAULT;
ALTER TABLE public.community_reports ALTER COLUMN report_id DROP DEFAULT;
ALTER TABLE public.community_qa_relation ALTER COLUMN qa_id DROP DEFAULT;
ALTER TABLE public.community_likes ALTER COLUMN like_id DROP DEFAULT;
ALTER TABLE public.community_follows ALTER COLUMN follow_id DROP DEFAULT;
ALTER TABLE public.community_content_tags ALTER COLUMN id DROP DEFAULT;
ALTER TABLE public.community_content ALTER COLUMN content_id DROP DEFAULT;
ALTER TABLE public.community_comments ALTER COLUMN comment_id DROP DEFAULT;
ALTER TABLE public.community_collects ALTER COLUMN collect_id DROP DEFAULT;
ALTER TABLE public.community_categories ALTER COLUMN category_id DROP DEFAULT;
ALTER TABLE public.community_blacklist ALTER COLUMN black_id DROP DEFAULT;
DROP SEQUENCE public.sys_user_user_id_seq;
DROP SEQUENCE public.sys_user_farmer_farmer_id_seq;
DROP TABLE public.sys_user_farmer;
DROP SEQUENCE public.sys_user_cert_material_material_id_seq;
DROP TABLE public.sys_user_cert_material;
DROP SEQUENCE public.sys_user_cert_apply_apply_id_seq;
DROP TABLE public.sys_user_cert_apply;
DROP SEQUENCE public.sys_user_buyer_buyer_id_seq;
DROP TABLE public.sys_user_buyer;
DROP SEQUENCE public.sys_user_address_address_id_seq;
DROP TABLE public.sys_user_address;
DROP TABLE public.sys_user;
DROP SEQUENCE public.sys_cert_type_cert_type_id_seq;
DROP TABLE public.sys_cert_type;
DROP SEQUENCE public.price_predictions_id_seq;
DROP TABLE public.price_predictions;
DROP SEQUENCE public.price_forecasts_id_seq;
DROP TABLE public.price_forecasts;
DROP SEQUENCE public.prediction_logs_id_seq;
DROP TABLE public.prediction_logs;
DROP SEQUENCE public.mall_user_footprint_footprint_id_seq;
DROP TABLE public.mall_user_footprint;
DROP SEQUENCE public.mall_user_follow_follow_id_seq;
DROP TABLE public.mall_user_follow;
DROP SEQUENCE public.mall_user_coupon_user_coupon_id_seq;
DROP TABLE public.mall_user_coupon;
DROP SEQUENCE public.mall_user_collection_collection_id_seq;
DROP TABLE public.mall_user_collection;
DROP SEQUENCE public.mall_supply_demand_match_match_id_seq;
DROP TABLE public.mall_supply_demand_match;
DROP SEQUENCE public.mall_shopping_cart_cart_id_seq;
DROP TABLE public.mall_shopping_cart;
DROP SEQUENCE public.mall_product_price_stat_stat_id_seq;
DROP TABLE public.mall_product_price_stat;
DROP SEQUENCE public.mall_product_category_category_id_seq;
DROP TABLE public.mall_product_category;
DROP TABLE public.mall_order_main;
DROP SEQUENCE public.mall_order_item_item_id_seq;
DROP TABLE public.mall_order_item;
DROP SEQUENCE public.mall_order_invoice_invoice_id_seq;
DROP TABLE public.mall_order_invoice;
DROP SEQUENCE public.mall_order_aftersale_aftersale_id_seq;
DROP TABLE public.mall_order_aftersale;
DROP SEQUENCE public.mall_operation_log_log_id_seq;
DROP TABLE public.mall_operation_log;
DROP SEQUENCE public.mall_farmer_source_source_id_seq;
DROP TABLE public.mall_farmer_source;
DROP SEQUENCE public.mall_discount_activity_activity_id_seq;
DROP TABLE public.mall_discount_activity;
DROP SEQUENCE public.mall_coupon_rule_rule_id_seq;
DROP TABLE public.mall_coupon_rule;
DROP SEQUENCE public.mall_buyer_demand_demand_id_seq;
DROP TABLE public.mall_buyer_demand;
DROP SEQUENCE public.historical_prices_id_seq;
DROP TABLE public.historical_prices;
DROP SEQUENCE public.forecast_job_logs_id_seq;
DROP TABLE public.forecast_job_logs;
DROP SEQUENCE public.financing_repayment_schedule_schedule_id_seq;
DROP TABLE public.financing_repayment_schedule;
DROP SEQUENCE public.financing_repayment_adjustment_request_request_id_seq;
DROP TABLE public.financing_repayment_adjustment_request;
DROP SEQUENCE public.financing_presale_subscription_subscription_id_seq;
DROP TABLE public.financing_presale_subscription;
DROP SEQUENCE public.financing_presale_plan_plan_id_seq;
DROP TABLE public.financing_presale_plan;
DROP SEQUENCE public.financing_loan_type_loan_type_id_seq;
DROP TABLE public.financing_loan_type;
DROP SEQUENCE public.financing_credit_evaluation_evaluation_id_seq;
DROP TABLE public.financing_credit_evaluation;
DROP SEQUENCE public.financing_bank_bank_id_seq;
DROP SEQUENCE public.financing_bank_approval_approval_id_seq;
DROP TABLE public.financing_bank_approval;
DROP TABLE public.financing_bank;
DROP SEQUENCE public.financing_application_application_id_seq;
DROP TABLE public.financing_application;
DROP SEQUENCE public.community_violations_violation_id_seq;
DROP TABLE public.community_violations;
DROP SEQUENCE public.community_tags_tag_id_seq;
DROP TABLE public.community_tags;
DROP SEQUENCE public.community_reports_report_id_seq;
DROP TABLE public.community_reports;
DROP SEQUENCE public.community_qa_relation_qa_id_seq;
DROP TABLE public.community_qa_relation;
DROP SEQUENCE public.community_likes_like_id_seq;
DROP TABLE public.community_likes;
DROP SEQUENCE public.community_follows_follow_id_seq;
DROP TABLE public.community_follows;
DROP SEQUENCE public.community_content_tags_id_seq;
DROP TABLE public.community_content_tags;
DROP SEQUENCE public.community_content_content_id_seq;
DROP TABLE public.community_content;
DROP SEQUENCE public.community_comments_comment_id_seq;
DROP TABLE public.community_comments;
DROP SEQUENCE public.community_collects_collect_id_seq;
DROP TABLE public.community_collects;
DROP SEQUENCE public.community_categories_category_id_seq;
DROP TABLE public.community_categories;
DROP SEQUENCE public.community_blacklist_black_id_seq;
DROP TABLE public.community_blacklist;
DROP FUNCTION public.update_updated_at_column();
DROP FUNCTION public.update_timestamp_column();
--
-- Name: update_timestamp_column(); Type: FUNCTION; Schema: public; Owner: agri_root
--

CREATE FUNCTION public.update_timestamp_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
   NEW.update_time = now();
   RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_timestamp_column() OWNER TO agri_root;

--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: agri_root
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.update_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO agri_root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: community_blacklist; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.community_blacklist (
    black_id integer NOT NULL,
    blocker_id integer NOT NULL,
    blacked_user_id integer NOT NULL,
    black_reason character varying(500),
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.community_blacklist OWNER TO agri_root;

--
-- Name: TABLE community_blacklist; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.community_blacklist IS '用户黑名单表';


--
-- Name: COLUMN community_blacklist.blocker_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_blacklist.blocker_id IS '拉黑者用户ID';


--
-- Name: COLUMN community_blacklist.blacked_user_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_blacklist.blacked_user_id IS '被拉黑用户ID';


--
-- Name: COLUMN community_blacklist.black_reason; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_blacklist.black_reason IS '拉黑原因';


--
-- Name: community_blacklist_black_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.community_blacklist_black_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_blacklist_black_id_seq OWNER TO agri_root;

--
-- Name: community_blacklist_black_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.community_blacklist_black_id_seq OWNED BY public.community_blacklist.black_id;


--
-- Name: community_categories; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.community_categories (
    category_id integer NOT NULL,
    parent_id integer DEFAULT 0,
    category_name character varying(100) NOT NULL,
    category_desc character varying(500),
    sort_order integer DEFAULT 0,
    is_enabled smallint DEFAULT 1,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.community_categories OWNER TO agri_root;

--
-- Name: TABLE community_categories; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.community_categories IS '内容分类表';


--
-- Name: COLUMN community_categories.parent_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_categories.parent_id IS '父分类ID，0表示顶级分类';


--
-- Name: COLUMN community_categories.category_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_categories.category_name IS '分类名称';


--
-- Name: COLUMN community_categories.category_desc; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_categories.category_desc IS '分类描述';


--
-- Name: COLUMN community_categories.sort_order; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_categories.sort_order IS '排序';


--
-- Name: COLUMN community_categories.is_enabled; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_categories.is_enabled IS '是否启用：0=禁用，1=启用';


--
-- Name: community_categories_category_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.community_categories_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_categories_category_id_seq OWNER TO agri_root;

--
-- Name: community_categories_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.community_categories_category_id_seq OWNED BY public.community_categories.category_id;


--
-- Name: community_collects; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.community_collects (
    collect_id integer NOT NULL,
    content_id integer NOT NULL,
    user_id integer NOT NULL,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.community_collects OWNER TO agri_root;

--
-- Name: TABLE community_collects; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.community_collects IS '收藏表';


--
-- Name: COLUMN community_collects.content_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_collects.content_id IS '内容ID';


--
-- Name: COLUMN community_collects.user_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_collects.user_id IS '用户ID';


--
-- Name: community_collects_collect_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.community_collects_collect_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_collects_collect_id_seq OWNER TO agri_root;

--
-- Name: community_collects_collect_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.community_collects_collect_id_seq OWNED BY public.community_collects.collect_id;


--
-- Name: community_comments; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.community_comments (
    comment_id integer NOT NULL,
    content_id integer NOT NULL,
    commenter_id integer NOT NULL,
    parent_id integer DEFAULT 0,
    comment_text text NOT NULL,
    like_count integer DEFAULT 0,
    audit_status smallint DEFAULT 1,
    is_deleted smallint DEFAULT 0,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.community_comments OWNER TO agri_root;

--
-- Name: TABLE community_comments; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.community_comments IS '评论表';


--
-- Name: COLUMN community_comments.content_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_comments.content_id IS '内容ID';


--
-- Name: COLUMN community_comments.commenter_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_comments.commenter_id IS '评论者用户ID';


--
-- Name: COLUMN community_comments.parent_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_comments.parent_id IS '父评论ID，0表示对内容的评论';


--
-- Name: COLUMN community_comments.comment_text; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_comments.comment_text IS '评论内容';


--
-- Name: COLUMN community_comments.like_count; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_comments.like_count IS '点赞数';


--
-- Name: COLUMN community_comments.audit_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_comments.audit_status IS '审核状态：0=待审核，1=已通过，2=未通过';


--
-- Name: COLUMN community_comments.is_deleted; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_comments.is_deleted IS '是否删除';


--
-- Name: community_comments_comment_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.community_comments_comment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_comments_comment_id_seq OWNER TO agri_root;

--
-- Name: community_comments_comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.community_comments_comment_id_seq OWNED BY public.community_comments.comment_id;


--
-- Name: community_content; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.community_content (
    content_id integer NOT NULL,
    author_id integer NOT NULL,
    category_id integer NOT NULL,
    content_type smallint NOT NULL,
    content_title character varying(200) NOT NULL,
    content_text text NOT NULL,
    content_cover character varying(500),
    view_count integer DEFAULT 0,
    like_count integer DEFAULT 0,
    comment_count integer DEFAULT 0,
    collect_count integer DEFAULT 0,
    share_count integer DEFAULT 0,
    audit_status smallint DEFAULT 0,
    is_deleted smallint DEFAULT 0,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.community_content OWNER TO agri_root;

--
-- Name: TABLE community_content; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.community_content IS '社区内容表';


--
-- Name: COLUMN community_content.author_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_content.author_id IS '作者用户ID';


--
-- Name: COLUMN community_content.category_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_content.category_id IS '分类ID';


--
-- Name: COLUMN community_content.content_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_content.content_type IS '内容类型：1=经验分享，2=求助，3=问题咨询';


--
-- Name: COLUMN community_content.content_title; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_content.content_title IS '标题';


--
-- Name: COLUMN community_content.content_text; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_content.content_text IS '内容正文';


--
-- Name: COLUMN community_content.content_cover; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_content.content_cover IS '封面图';


--
-- Name: COLUMN community_content.view_count; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_content.view_count IS '浏览量';


--
-- Name: COLUMN community_content.like_count; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_content.like_count IS '点赞数';


--
-- Name: COLUMN community_content.comment_count; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_content.comment_count IS '评论数';


--
-- Name: COLUMN community_content.collect_count; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_content.collect_count IS '收藏数';


--
-- Name: COLUMN community_content.share_count; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_content.share_count IS '分享数';


--
-- Name: COLUMN community_content.audit_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_content.audit_status IS '审核状态：0=待审核，1=已通过，2=未通过';


--
-- Name: COLUMN community_content.is_deleted; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_content.is_deleted IS '是否删除：0=否，1=是';


--
-- Name: community_content_content_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.community_content_content_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_content_content_id_seq OWNER TO agri_root;

--
-- Name: community_content_content_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.community_content_content_id_seq OWNED BY public.community_content.content_id;


--
-- Name: community_content_tags; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.community_content_tags (
    id integer NOT NULL,
    content_id integer NOT NULL,
    tag_id integer NOT NULL,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.community_content_tags OWNER TO agri_root;

--
-- Name: TABLE community_content_tags; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.community_content_tags IS '内容标签关联表';


--
-- Name: COLUMN community_content_tags.content_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_content_tags.content_id IS '内容ID';


--
-- Name: COLUMN community_content_tags.tag_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_content_tags.tag_id IS '标签ID';


--
-- Name: community_content_tags_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.community_content_tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_content_tags_id_seq OWNER TO agri_root;

--
-- Name: community_content_tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.community_content_tags_id_seq OWNED BY public.community_content_tags.id;


--
-- Name: community_follows; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.community_follows (
    follow_id integer NOT NULL,
    follower_id integer NOT NULL,
    followed_id integer NOT NULL,
    follow_source smallint DEFAULT 1,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.community_follows OWNER TO agri_root;

--
-- Name: TABLE community_follows; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.community_follows IS '用户关注关系表';


--
-- Name: COLUMN community_follows.follower_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_follows.follower_id IS '关注者用户ID';


--
-- Name: COLUMN community_follows.followed_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_follows.followed_id IS '被关注者用户ID';


--
-- Name: COLUMN community_follows.follow_source; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_follows.follow_source IS '关注来源：1=主动关注';


--
-- Name: community_follows_follow_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.community_follows_follow_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_follows_follow_id_seq OWNER TO agri_root;

--
-- Name: community_follows_follow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.community_follows_follow_id_seq OWNED BY public.community_follows.follow_id;


--
-- Name: community_likes; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.community_likes (
    like_id integer NOT NULL,
    content_id integer NOT NULL,
    user_id integer NOT NULL,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.community_likes OWNER TO agri_root;

--
-- Name: TABLE community_likes; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.community_likes IS '点赞表';


--
-- Name: COLUMN community_likes.content_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_likes.content_id IS '内容ID';


--
-- Name: COLUMN community_likes.user_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_likes.user_id IS '用户ID';


--
-- Name: community_likes_like_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.community_likes_like_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_likes_like_id_seq OWNER TO agri_root;

--
-- Name: community_likes_like_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.community_likes_like_id_seq OWNED BY public.community_likes.like_id;


--
-- Name: community_qa_relation; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.community_qa_relation (
    qa_id integer NOT NULL,
    content_id integer NOT NULL,
    best_comment_id integer,
    qa_status smallint DEFAULT 0,
    resolve_time timestamp without time zone,
    reward_amount numeric(10,2) DEFAULT 0.00,
    reward_status smallint DEFAULT 0,
    reward_time timestamp without time zone,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.community_qa_relation OWNER TO agri_root;

--
-- Name: TABLE community_qa_relation; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.community_qa_relation IS '问答关系表';


--
-- Name: COLUMN community_qa_relation.content_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_qa_relation.content_id IS '问题内容ID';


--
-- Name: COLUMN community_qa_relation.best_comment_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_qa_relation.best_comment_id IS '最佳答案评论ID';


--
-- Name: COLUMN community_qa_relation.qa_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_qa_relation.qa_status IS '问答状态：0=待解决，1=已解决';


--
-- Name: COLUMN community_qa_relation.resolve_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_qa_relation.resolve_time IS '解决时间';


--
-- Name: COLUMN community_qa_relation.reward_amount; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_qa_relation.reward_amount IS '悬赏金额';


--
-- Name: COLUMN community_qa_relation.reward_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_qa_relation.reward_status IS '悬赏状态：0=未设置，1=待发放，2=已发放';


--
-- Name: COLUMN community_qa_relation.reward_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_qa_relation.reward_time IS '奖励发放时间';


--
-- Name: community_qa_relation_qa_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.community_qa_relation_qa_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_qa_relation_qa_id_seq OWNER TO agri_root;

--
-- Name: community_qa_relation_qa_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.community_qa_relation_qa_id_seq OWNED BY public.community_qa_relation.qa_id;


--
-- Name: community_reports; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.community_reports (
    report_id integer NOT NULL,
    report_no character varying(50) NOT NULL,
    reporter_id integer NOT NULL,
    report_type smallint NOT NULL,
    report_obj_id integer NOT NULL,
    report_reason smallint NOT NULL,
    report_detail text,
    report_evidence text,
    is_anonymous smallint DEFAULT 0,
    audit_status smallint DEFAULT 0,
    auditor_id integer,
    audit_time timestamp without time zone,
    audit_remark character varying(500),
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.community_reports OWNER TO agri_root;

--
-- Name: TABLE community_reports; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.community_reports IS '举报表';


--
-- Name: COLUMN community_reports.report_no; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_reports.report_no IS '举报编号';


--
-- Name: COLUMN community_reports.reporter_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_reports.reporter_id IS '举报者用户ID';


--
-- Name: COLUMN community_reports.report_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_reports.report_type IS '举报类型：1=内容，2=评论，3=用户';


--
-- Name: COLUMN community_reports.report_obj_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_reports.report_obj_id IS '被举报对象ID';


--
-- Name: COLUMN community_reports.report_reason; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_reports.report_reason IS '举报原因：1=违法违规，2=广告营销，3=不实信息';


--
-- Name: COLUMN community_reports.report_detail; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_reports.report_detail IS '举报详情';


--
-- Name: COLUMN community_reports.report_evidence; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_reports.report_evidence IS '举报证据（JSON数组）';


--
-- Name: COLUMN community_reports.is_anonymous; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_reports.is_anonymous IS '是否匿名举报';


--
-- Name: COLUMN community_reports.audit_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_reports.audit_status IS '审核状态：0=待处理，1=已立案，2=不予立案';


--
-- Name: COLUMN community_reports.auditor_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_reports.auditor_id IS '审核人ID';


--
-- Name: COLUMN community_reports.audit_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_reports.audit_time IS '审核时间';


--
-- Name: COLUMN community_reports.audit_remark; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_reports.audit_remark IS '审核备注';


--
-- Name: community_reports_report_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.community_reports_report_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_reports_report_id_seq OWNER TO agri_root;

--
-- Name: community_reports_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.community_reports_report_id_seq OWNED BY public.community_reports.report_id;


--
-- Name: community_tags; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.community_tags (
    tag_id integer NOT NULL,
    tag_name character varying(50) NOT NULL,
    use_count integer DEFAULT 0,
    is_enabled smallint DEFAULT 1,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.community_tags OWNER TO agri_root;

--
-- Name: TABLE community_tags; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.community_tags IS '标签表';


--
-- Name: COLUMN community_tags.tag_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_tags.tag_name IS '标签名称';


--
-- Name: COLUMN community_tags.use_count; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_tags.use_count IS '使用次数';


--
-- Name: COLUMN community_tags.is_enabled; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_tags.is_enabled IS '是否启用';


--
-- Name: community_tags_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.community_tags_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_tags_tag_id_seq OWNER TO agri_root;

--
-- Name: community_tags_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.community_tags_tag_id_seq OWNED BY public.community_tags.tag_id;


--
-- Name: community_violations; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.community_violations (
    violation_id integer NOT NULL,
    report_id integer,
    violator_id integer NOT NULL,
    violation_type smallint NOT NULL,
    violation_obj_id integer NOT NULL,
    handle_measure smallint NOT NULL,
    handle_remark character varying(500),
    handler_id integer NOT NULL,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.community_violations OWNER TO agri_root;

--
-- Name: TABLE community_violations; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.community_violations IS '违规记录表';


--
-- Name: COLUMN community_violations.report_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_violations.report_id IS '关联的举报ID';


--
-- Name: COLUMN community_violations.violator_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_violations.violator_id IS '违规者用户ID';


--
-- Name: COLUMN community_violations.violation_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_violations.violation_type IS '违规类型：1=内容违规，2=评论违规，3=用户违规';


--
-- Name: COLUMN community_violations.violation_obj_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_violations.violation_obj_id IS '违规对象ID';


--
-- Name: COLUMN community_violations.handle_measure; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_violations.handle_measure IS '处理措施：1=删除内容，2=警告，3=禁言，4=封号';


--
-- Name: COLUMN community_violations.handle_remark; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_violations.handle_remark IS '处理说明';


--
-- Name: COLUMN community_violations.handler_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.community_violations.handler_id IS '处理人ID';


--
-- Name: community_violations_violation_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.community_violations_violation_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.community_violations_violation_id_seq OWNER TO agri_root;

--
-- Name: community_violations_violation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.community_violations_violation_id_seq OWNED BY public.community_violations.violation_id;


--
-- Name: financing_application; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.financing_application (
    application_id bigint NOT NULL,
    application_no character varying(32) NOT NULL,
    application_status integer NOT NULL,
    apply_amount numeric(15,2) NOT NULL,
    apply_term integer NOT NULL,
    apply_term_type integer NOT NULL,
    bank_id integer NOT NULL,
    cancel_reason character varying(500),
    cancel_time timestamp(6) without time zone,
    contact_address character varying(200) NOT NULL,
    contact_phone character varying(20) NOT NULL,
    create_time timestamp(6) without time zone NOT NULL,
    loan_purpose_detail character varying(500) NOT NULL,
    loan_type_id integer NOT NULL,
    material_urls character varying(1000) NOT NULL,
    repayment_plan character varying(500) NOT NULL,
    source_id bigint,
    update_time timestamp(6) without time zone NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.financing_application OWNER TO agri_root;

--
-- Name: financing_application_application_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.financing_application_application_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financing_application_application_id_seq OWNER TO agri_root;

--
-- Name: financing_application_application_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.financing_application_application_id_seq OWNED BY public.financing_application.application_id;


--
-- Name: financing_bank; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.financing_bank (
    bank_id integer NOT NULL,
    approval_cycle character varying(50) NOT NULL,
    bank_city character varying(50),
    bank_logo character varying(200),
    bank_name character varying(100) NOT NULL,
    bank_province character varying(50) NOT NULL,
    bank_short_name character varying(50) NOT NULL,
    bank_status integer NOT NULL,
    contact_department character varying(100) NOT NULL,
    contact_email character varying(100),
    contact_person character varying(50) NOT NULL,
    contact_phone character varying(20) NOT NULL,
    create_time timestamp(6) without time zone NOT NULL,
    supported_loan_types character varying(200) NOT NULL,
    update_time timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.financing_bank OWNER TO agri_root;

--
-- Name: financing_bank_approval; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.financing_bank_approval (
    approval_id bigint NOT NULL,
    application_id bigint NOT NULL,
    approval_amount numeric(15,2),
    approval_remark character varying(500) NOT NULL,
    approval_result integer NOT NULL,
    approval_term integer,
    approval_time timestamp(6) without time zone NOT NULL,
    approver_id bigint NOT NULL,
    approver_name character varying(50) NOT NULL,
    bank_id integer NOT NULL,
    interest_rate numeric(5,4),
    loan_account character varying(50),
    loan_contract_url character varying(200),
    loan_time timestamp(6) without time zone,
    repayment_method character varying(100),
    sign_time timestamp(6) without time zone
);


ALTER TABLE public.financing_bank_approval OWNER TO agri_root;

--
-- Name: financing_bank_approval_approval_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.financing_bank_approval_approval_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financing_bank_approval_approval_id_seq OWNER TO agri_root;

--
-- Name: financing_bank_approval_approval_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.financing_bank_approval_approval_id_seq OWNED BY public.financing_bank_approval.approval_id;


--
-- Name: financing_bank_bank_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.financing_bank_bank_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financing_bank_bank_id_seq OWNER TO agri_root;

--
-- Name: financing_bank_bank_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.financing_bank_bank_id_seq OWNED BY public.financing_bank.bank_id;


--
-- Name: financing_credit_evaluation; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.financing_credit_evaluation (
    evaluation_id bigint NOT NULL,
    application_id bigint NOT NULL,
    credit_level character varying(20) NOT NULL,
    credit_report_url character varying(200),
    credit_score integer NOT NULL,
    data_sources character varying(500) NOT NULL,
    evaluation_remark character varying(500),
    evaluation_result integer NOT NULL,
    evaluation_time timestamp(6) without time zone NOT NULL,
    evaluation_type integer NOT NULL,
    evaluator_id bigint,
    report_generate_time timestamp(6) without time zone,
    score_detail text NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.financing_credit_evaluation OWNER TO agri_root;

--
-- Name: financing_credit_evaluation_evaluation_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.financing_credit_evaluation_evaluation_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financing_credit_evaluation_evaluation_id_seq OWNER TO agri_root;

--
-- Name: financing_credit_evaluation_evaluation_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.financing_credit_evaluation_evaluation_id_seq OWNED BY public.financing_credit_evaluation.evaluation_id;


--
-- Name: financing_loan_type; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.financing_loan_type (
    loan_type_id integer NOT NULL,
    applicable_objects character varying(200) NOT NULL,
    create_time timestamp(6) without time zone NOT NULL,
    interest_rate_type integer NOT NULL,
    loan_purpose character varying(200) NOT NULL,
    loan_term_type integer NOT NULL,
    loan_type_name character varying(100) NOT NULL,
    max_interest_rate numeric(5,4) NOT NULL,
    max_loan_amount numeric(15,2) NOT NULL,
    max_loan_term integer NOT NULL,
    min_interest_rate numeric(5,4) NOT NULL,
    min_loan_amount numeric(15,2) NOT NULL,
    min_loan_term integer NOT NULL,
    required_materials character varying(500) NOT NULL,
    sort integer,
    status integer NOT NULL,
    support_banks character varying(500) NOT NULL,
    update_time timestamp(6) without time zone NOT NULL
);


ALTER TABLE public.financing_loan_type OWNER TO agri_root;

--
-- Name: financing_loan_type_loan_type_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.financing_loan_type_loan_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financing_loan_type_loan_type_id_seq OWNER TO agri_root;

--
-- Name: financing_loan_type_loan_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.financing_loan_type_loan_type_id_seq OWNED BY public.financing_loan_type.loan_type_id;


--
-- Name: financing_presale_plan; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.financing_presale_plan (
    plan_id bigint NOT NULL,
    plan_no character varying(32) NOT NULL,
    user_id bigint NOT NULL,
    category_id integer NOT NULL,
    product_name character varying(100) NOT NULL,
    plant_date date NOT NULL,
    expected_harvest_date date NOT NULL,
    total_yield_quantity numeric(15,2) NOT NULL,
    presale_unit_price numeric(10,2) NOT NULL,
    deposit_ratio numeric(5,2) NOT NULL,
    subscribed_quantity numeric(15,2) DEFAULT 0,
    plan_status integer DEFAULT 0,
    audit_status integer DEFAULT 0,
    audit_remark character varying(500),
    create_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT financing_presale_plan_deposit_ratio_check CHECK (((deposit_ratio > (0)::numeric) AND (deposit_ratio <= (1)::numeric)))
);


ALTER TABLE public.financing_presale_plan OWNER TO agri_root;

--
-- Name: TABLE financing_presale_plan; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.financing_presale_plan IS '农产品预售计划表';


--
-- Name: COLUMN financing_presale_plan.plan_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_plan.plan_id IS '计划 ID (自增主键)';


--
-- Name: COLUMN financing_presale_plan.plan_no; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_plan.plan_no IS '计划编号 (PRE + 年月日 + 8位随机数)';


--
-- Name: COLUMN financing_presale_plan.user_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_plan.user_id IS '发布农户 ID (关联 sys_user)';


--
-- Name: COLUMN financing_presale_plan.category_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_plan.category_id IS '农产品品类 ID (关联 mall_product_category)';


--
-- Name: COLUMN financing_presale_plan.product_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_plan.product_name IS '预售产品名称 (如 “2026年春季有机番茄”)';


--
-- Name: COLUMN financing_presale_plan.plant_date; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_plan.plant_date IS '预计种植日期';


--
-- Name: COLUMN financing_presale_plan.expected_harvest_date; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_plan.expected_harvest_date IS '预计收获日期';


--
-- Name: COLUMN financing_presale_plan.total_yield_quantity; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_plan.total_yield_quantity IS '预计总产量 (kg)';


--
-- Name: COLUMN financing_presale_plan.presale_unit_price; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_plan.presale_unit_price IS '预售单价 (元/kg)';


--
-- Name: COLUMN financing_presale_plan.deposit_ratio; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_plan.deposit_ratio IS '定金比例 (如 “0.3” 表示30%)';


--
-- Name: COLUMN financing_presale_plan.subscribed_quantity; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_plan.subscribed_quantity IS '已被预订数量 (kg)';


--
-- Name: COLUMN financing_presale_plan.plan_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_plan.plan_status IS '计划状态: 0=草稿, 1=待审核, 2=预售中, 3=预售满额, 4=生产中, 5=已收获, 6=已完成, 7=已取消';


--
-- Name: COLUMN financing_presale_plan.audit_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_plan.audit_status IS '平台审核状态: 0=待审核, 1=通过, 2=驳回';


--
-- Name: COLUMN financing_presale_plan.audit_remark; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_plan.audit_remark IS '审核意见';


--
-- Name: COLUMN financing_presale_plan.create_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_plan.create_time IS '创建时间';


--
-- Name: financing_presale_plan_plan_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.financing_presale_plan_plan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financing_presale_plan_plan_id_seq OWNER TO agri_root;

--
-- Name: financing_presale_plan_plan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.financing_presale_plan_plan_id_seq OWNED BY public.financing_presale_plan.plan_id;


--
-- Name: financing_presale_subscription; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.financing_presale_subscription (
    subscription_id bigint NOT NULL,
    subscription_no character varying(32) NOT NULL,
    plan_id bigint NOT NULL,
    user_id bigint NOT NULL,
    subscribed_quantity numeric(15,2) NOT NULL,
    deposit_amount numeric(15,2) NOT NULL,
    payment_status integer DEFAULT 0,
    payment_no character varying(50),
    subscription_status integer DEFAULT 1,
    create_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.financing_presale_subscription OWNER TO agri_root;

--
-- Name: TABLE financing_presale_subscription; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.financing_presale_subscription IS '买家预售认购表';


--
-- Name: COLUMN financing_presale_subscription.subscription_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_subscription.subscription_id IS '认购 ID (自增主键)';


--
-- Name: COLUMN financing_presale_subscription.subscription_no; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_subscription.subscription_no IS '认购编号 (SUB + 年月日 + 8位随机数)';


--
-- Name: COLUMN financing_presale_subscription.plan_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_subscription.plan_id IS '关联预售计划 ID';


--
-- Name: COLUMN financing_presale_subscription.user_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_subscription.user_id IS '认购买家 ID (关联 sys_user)';


--
-- Name: COLUMN financing_presale_subscription.subscribed_quantity; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_subscription.subscribed_quantity IS '认购数量 (kg)';


--
-- Name: COLUMN financing_presale_subscription.deposit_amount; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_subscription.deposit_amount IS '应付定金';


--
-- Name: COLUMN financing_presale_subscription.payment_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_subscription.payment_status IS '支付状态: 0=待支付, 1=已支付, 2=已退款';


--
-- Name: COLUMN financing_presale_subscription.payment_no; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_subscription.payment_no IS '支付单号';


--
-- Name: COLUMN financing_presale_subscription.subscription_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_subscription.subscription_status IS '认购状态: 1=有效, 0=已取消';


--
-- Name: COLUMN financing_presale_subscription.create_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.financing_presale_subscription.create_time IS '认购时间';


--
-- Name: financing_presale_subscription_subscription_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.financing_presale_subscription_subscription_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financing_presale_subscription_subscription_id_seq OWNER TO agri_root;

--
-- Name: financing_presale_subscription_subscription_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.financing_presale_subscription_subscription_id_seq OWNED BY public.financing_presale_subscription.subscription_id;


--
-- Name: financing_repayment_adjustment_request; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.financing_repayment_adjustment_request (
    request_id bigint NOT NULL,
    application_id bigint NOT NULL,
    approval_remark character varying(500),
    approval_time timestamp(6) without time zone,
    approver_id bigint,
    create_time timestamp(6) without time zone NOT NULL,
    proposed_plan_details text CONSTRAINT financing_repayment_adjustment_r_proposed_plan_details_not_null NOT NULL,
    request_reason character varying(500) NOT NULL,
    request_status integer,
    user_id bigint NOT NULL
);


ALTER TABLE public.financing_repayment_adjustment_request OWNER TO agri_root;

--
-- Name: financing_repayment_adjustment_request_request_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.financing_repayment_adjustment_request_request_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financing_repayment_adjustment_request_request_id_seq OWNER TO agri_root;

--
-- Name: financing_repayment_adjustment_request_request_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.financing_repayment_adjustment_request_request_id_seq OWNED BY public.financing_repayment_adjustment_request.request_id;


--
-- Name: financing_repayment_schedule; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.financing_repayment_schedule (
    schedule_id bigint NOT NULL,
    adjustment_request_id bigint,
    application_id bigint NOT NULL,
    due_date date NOT NULL,
    interest_due numeric(15,2) NOT NULL,
    interest_paid numeric(15,2),
    payment_status integer,
    principal_due numeric(15,2) NOT NULL,
    principal_paid numeric(15,2),
    term_number integer NOT NULL
);


ALTER TABLE public.financing_repayment_schedule OWNER TO agri_root;

--
-- Name: financing_repayment_schedule_schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.financing_repayment_schedule_schedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financing_repayment_schedule_schedule_id_seq OWNER TO agri_root;

--
-- Name: financing_repayment_schedule_schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.financing_repayment_schedule_schedule_id_seq OWNED BY public.financing_repayment_schedule.schedule_id;


--
-- Name: forecast_job_logs; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.forecast_job_logs (
    id integer NOT NULL,
    job_start_time timestamp without time zone NOT NULL,
    job_end_time timestamp without time zone,
    status character varying(20) NOT NULL,
    products_processed integer DEFAULT 0,
    forecasts_generated integer DEFAULT 0,
    error_message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.forecast_job_logs OWNER TO agri_root;

--
-- Name: TABLE forecast_job_logs; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.forecast_job_logs IS '预测任务执行日志表';


--
-- Name: forecast_job_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.forecast_job_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.forecast_job_logs_id_seq OWNER TO agri_root;

--
-- Name: forecast_job_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.forecast_job_logs_id_seq OWNED BY public.forecast_job_logs.id;


--
-- Name: historical_prices; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.historical_prices (
    id integer NOT NULL,
    product_name character varying(100) NOT NULL,
    product_category character varying(50),
    region character varying(100) DEFAULT '全国'::character varying,
    price_date date NOT NULL,
    price numeric(10,2) NOT NULL,
    unit character varying(20) DEFAULT '元/kg'::character varying,
    source character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.historical_prices OWNER TO agri_root;

--
-- Name: TABLE historical_prices; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.historical_prices IS '历史价格数据表，用于模型训练';


--
-- Name: historical_prices_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.historical_prices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.historical_prices_id_seq OWNER TO agri_root;

--
-- Name: historical_prices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.historical_prices_id_seq OWNED BY public.historical_prices.id;


--
-- Name: mall_buyer_demand; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_buyer_demand (
    demand_id bigint NOT NULL,
    user_id bigint NOT NULL,
    category_id integer NOT NULL,
    demand_no character varying(32) NOT NULL,
    product_name character varying(100) NOT NULL,
    product_spec character varying(100) NOT NULL,
    origin_require character varying(100),
    required_quantity numeric(15,2) NOT NULL,
    purchased_quantity numeric(15,2) DEFAULT 0,
    max_unit_price numeric(10,2) NOT NULL,
    delivery_address_id bigint NOT NULL,
    latest_delivery_date date NOT NULL,
    payment_type smallint DEFAULT 1,
    demand_desc text,
    match_source_ids character varying(500),
    demand_status smallint DEFAULT 1,
    cancel_time timestamp without time zone,
    cancel_reason character varying(500),
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mall_buyer_demand OWNER TO agri_root;

--
-- Name: TABLE mall_buyer_demand; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_buyer_demand IS '买家求购表';


--
-- Name: COLUMN mall_buyer_demand.demand_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.demand_id IS '求购 ID (自增)';


--
-- Name: COLUMN mall_buyer_demand.user_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.user_id IS '求购买家 ID (关联 sys_user.user_id, 仅user_type=2)';


--
-- Name: COLUMN mall_buyer_demand.category_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.category_id IS '品类 ID (关联 mall_product_category.category_id)';


--
-- Name: COLUMN mall_buyer_demand.demand_no; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.demand_no IS '求购编号 (DEM+年月日+6位随机数)';


--
-- Name: COLUMN mall_buyer_demand.product_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.product_name IS '求购产品名称';


--
-- Name: COLUMN mall_buyer_demand.product_spec; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.product_spec IS '需求规格';


--
-- Name: COLUMN mall_buyer_demand.origin_require; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.origin_require IS '产地要求';


--
-- Name: COLUMN mall_buyer_demand.required_quantity; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.required_quantity IS '需求总量 (kg/件)';


--
-- Name: COLUMN mall_buyer_demand.purchased_quantity; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.purchased_quantity IS '已采购量 (匹配后自动累加)';


--
-- Name: COLUMN mall_buyer_demand.max_unit_price; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.max_unit_price IS '最高接受单价 (元/kg)';


--
-- Name: COLUMN mall_buyer_demand.delivery_address_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.delivery_address_id IS '交货地址 ID (关联 sys_user_address.address_id)';


--
-- Name: COLUMN mall_buyer_demand.latest_delivery_date; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.latest_delivery_date IS '最晚交货日期';


--
-- Name: COLUMN mall_buyer_demand.payment_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.payment_type IS '支付偏好: 1=在线支付、2=货到付款、3=两者都可';


--
-- Name: COLUMN mall_buyer_demand.demand_desc; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.demand_desc IS '求购描述';


--
-- Name: COLUMN mall_buyer_demand.match_source_ids; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.match_source_ids IS '匹配货源 ID (关联货源表)';


--
-- Name: COLUMN mall_buyer_demand.demand_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.demand_status IS '状态: 0=取消、1=待匹配、2=部分匹配、3=完全匹配、4=已完成';


--
-- Name: COLUMN mall_buyer_demand.cancel_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.cancel_time IS '取消时间 (demand_status=0时必填)';


--
-- Name: COLUMN mall_buyer_demand.cancel_reason; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.cancel_reason IS '取消原因 (demand_status=0时必填)';


--
-- Name: COLUMN mall_buyer_demand.create_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.create_time IS '发布时间';


--
-- Name: COLUMN mall_buyer_demand.update_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_buyer_demand.update_time IS '更新时间';


--
-- Name: mall_buyer_demand_demand_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_buyer_demand_demand_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_buyer_demand_demand_id_seq OWNER TO agri_root;

--
-- Name: mall_buyer_demand_demand_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_buyer_demand_demand_id_seq OWNED BY public.mall_buyer_demand.demand_id;


--
-- Name: mall_coupon_rule; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_coupon_rule (
    rule_id bigint NOT NULL,
    coupon_type smallint NOT NULL,
    coupon_name character varying(100) NOT NULL,
    face_value numeric(10,2),
    discount_rate numeric(5,2),
    min_use_amount numeric(12,2) DEFAULT 0 NOT NULL,
    max_discount_amount numeric(12,2),
    valid_start_time timestamp without time zone NOT NULL,
    valid_end_time timestamp without time zone NOT NULL,
    total_quantity integer NOT NULL,
    used_quantity integer DEFAULT 0 NOT NULL,
    obtain_limit integer DEFAULT 1 NOT NULL,
    apply_category_ids character varying(200),
    apply_source_ids character varying(1000),
    obtain_type smallint DEFAULT 1 NOT NULL,
    status smallint DEFAULT 1 NOT NULL,
    create_user bigint NOT NULL,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mall_coupon_rule OWNER TO agri_root;

--
-- Name: TABLE mall_coupon_rule; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_coupon_rule IS '优惠券规则表';


--
-- Name: COLUMN mall_coupon_rule.rule_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.rule_id IS '规则唯一ID (自增主键)';


--
-- Name: COLUMN mall_coupon_rule.coupon_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.coupon_type IS '优惠券类型: 1=满减券、2=折扣券、3=无门槛券';


--
-- Name: COLUMN mall_coupon_rule.coupon_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.coupon_name IS '优惠券名称';


--
-- Name: COLUMN mall_coupon_rule.face_value; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.face_value IS '券面金额 (仅满减券/无门槛券必填)';


--
-- Name: COLUMN mall_coupon_rule.discount_rate; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.discount_rate IS '折扣率 (仅折扣券必填, 如 “0.9" 表示9折)';


--
-- Name: COLUMN mall_coupon_rule.min_use_amount; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.min_use_amount IS '最低使用金额 (满减券必填; 无门槛券填0)';


--
-- Name: COLUMN mall_coupon_rule.max_discount_amount; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.max_discount_amount IS '最大优惠金额 (仅折扣券必填)';


--
-- Name: COLUMN mall_coupon_rule.valid_start_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.valid_start_time IS '有效期开始时间';


--
-- Name: COLUMN mall_coupon_rule.valid_end_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.valid_end_time IS '有效期结束时间';


--
-- Name: COLUMN mall_coupon_rule.total_quantity; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.total_quantity IS '总发行量';


--
-- Name: COLUMN mall_coupon_rule.used_quantity; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.used_quantity IS '已使用数量 (实时统计)';


--
-- Name: COLUMN mall_coupon_rule.obtain_limit; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.obtain_limit IS '单用户领取上限';


--
-- Name: COLUMN mall_coupon_rule.apply_category_ids; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.apply_category_ids IS '适用品类 ID (多个用逗号分隔, 为空则全品类)';


--
-- Name: COLUMN mall_coupon_rule.apply_source_ids; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.apply_source_ids IS '适用货源 ID (手动指定, 为空则自动匹配)';


--
-- Name: COLUMN mall_coupon_rule.obtain_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.obtain_type IS '领取方式: 1=手动领取、2=新用户自动发放、3=活动赠送';


--
-- Name: COLUMN mall_coupon_rule.status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.status IS '规则状态: 0=停用、1=启用 (未到有效期/已过期自动变为0)';


--
-- Name: COLUMN mall_coupon_rule.create_user; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.create_user IS '创建人 ID (关联 sys_user.user_id, 管理员)';


--
-- Name: COLUMN mall_coupon_rule.create_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.create_time IS '创建时间';


--
-- Name: COLUMN mall_coupon_rule.update_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_coupon_rule.update_time IS '更新时间';


--
-- Name: mall_coupon_rule_rule_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_coupon_rule_rule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_coupon_rule_rule_id_seq OWNER TO agri_root;

--
-- Name: mall_coupon_rule_rule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_coupon_rule_rule_id_seq OWNED BY public.mall_coupon_rule.rule_id;


--
-- Name: mall_discount_activity; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_discount_activity (
    activity_id bigint NOT NULL,
    activity_no character varying(32) NOT NULL,
    activity_name character varying(100) NOT NULL,
    activity_type smallint DEFAULT 1,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    discount_rule character varying(500) NOT NULL,
    apply_category_ids character varying(200),
    apply_source_ids character varying(1000),
    activity_status smallint DEFAULT 0,
    total_source_count integer DEFAULT 0,
    total_order_count integer DEFAULT 0,
    total_sales_amount numeric(15,2) DEFAULT 0,
    create_user bigint NOT NULL,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mall_discount_activity OWNER TO agri_root;

--
-- Name: TABLE mall_discount_activity; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_discount_activity IS '折扣活动表';


--
-- Name: COLUMN mall_discount_activity.activity_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.activity_id IS '活动 ID (自增)';


--
-- Name: COLUMN mall_discount_activity.activity_no; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.activity_no IS '活动编号 (DIS+年月日+6位随机数)';


--
-- Name: COLUMN mall_discount_activity.activity_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.activity_name IS '活动名称 (如 “2025 临期小麦折扣”)';


--
-- Name: COLUMN mall_discount_activity.activity_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.activity_type IS '类型: 1=临期折扣、2=库存清仓、3=节日促销';


--
-- Name: COLUMN mall_discount_activity.start_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.start_time IS '活动开始时间';


--
-- Name: COLUMN mall_discount_activity.end_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.end_time IS '活动结束时间';


--
-- Name: COLUMN mall_discount_activity.discount_rule; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.discount_rule IS '折扣规则 (如 “临期≤15天8折, ≤7天6折”)';


--
-- Name: COLUMN mall_discount_activity.apply_category_ids; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.apply_category_ids IS '适用品类 ID (如 “101,203”, 为空则全品类)';


--
-- Name: COLUMN mall_discount_activity.apply_source_ids; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.apply_source_ids IS '适用货源 ID (手动指定, 为空则自动匹配)';


--
-- Name: COLUMN mall_discount_activity.activity_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.activity_status IS '状态: 0=未开始、1=进行中、2=已结束、3=已取消';


--
-- Name: COLUMN mall_discount_activity.total_source_count; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.total_source_count IS '参与货源总数 (自动统计)';


--
-- Name: COLUMN mall_discount_activity.total_order_count; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.total_order_count IS '活动订单总数 (实时统计)';


--
-- Name: COLUMN mall_discount_activity.total_sales_amount; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.total_sales_amount IS '活动总销售额 (实时统计, 元)';


--
-- Name: COLUMN mall_discount_activity.create_user; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.create_user IS '创建人 ID (关联 sys_user.user_id, 管理员)';


--
-- Name: COLUMN mall_discount_activity.create_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.create_time IS '创建时间';


--
-- Name: COLUMN mall_discount_activity.update_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_discount_activity.update_time IS '更新时间';


--
-- Name: mall_discount_activity_activity_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_discount_activity_activity_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_discount_activity_activity_id_seq OWNER TO agri_root;

--
-- Name: mall_discount_activity_activity_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_discount_activity_activity_id_seq OWNED BY public.mall_discount_activity.activity_id;


--
-- Name: mall_farmer_source; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_farmer_source (
    source_id bigint NOT NULL,
    user_id bigint NOT NULL,
    category_id integer NOT NULL,
    source_no character varying(32) NOT NULL,
    product_name character varying(100) NOT NULL,
    product_spec character varying(100) NOT NULL,
    origin character varying(100) NOT NULL,
    plant_date date,
    harvest_date date,
    expire_date date,
    total_quantity numeric(15,2) NOT NULL,
    surplus_quantity numeric(15,2) DEFAULT 0.00,
    unit_price numeric(10,2) NOT NULL,
    batch_price numeric(10,2),
    batch_quantity numeric(15,2),
    is_discount smallint DEFAULT 0,
    product_images character varying(1000) NOT NULL,
    product_video character varying(200),
    product_desc text NOT NULL,
    logistics_type smallint DEFAULT 1,
    freight_rule character varying(200) NOT NULL,
    min_order_quantity numeric(15,2) DEFAULT 1.00,
    audit_status smallint DEFAULT 0,
    audit_user bigint,
    audit_time timestamp without time zone,
    audit_remark character varying(500),
    source_status smallint DEFAULT 1,
    view_count integer DEFAULT 0,
    collect_count integer DEFAULT 0,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mall_farmer_source OWNER TO agri_root;

--
-- Name: TABLE mall_farmer_source; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_farmer_source IS '农户货源表';


--
-- Name: COLUMN mall_farmer_source.source_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.source_id IS '货源 ID (自增)';


--
-- Name: COLUMN mall_farmer_source.user_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.user_id IS '发布农户 ID (关联 sys_user.user_id, 仅user_type=1)';


--
-- Name: COLUMN mall_farmer_source.category_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.category_id IS '品类 ID (关联 mall_product_category.category_id)';


--
-- Name: COLUMN mall_farmer_source.source_no; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.source_no IS '货源编号 (SRC+年月日+6位随机数, 溯源用)';


--
-- Name: COLUMN mall_farmer_source.product_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.product_name IS '农产品名称';


--
-- Name: COLUMN mall_farmer_source.product_spec; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.product_spec IS '规格';


--
-- Name: COLUMN mall_farmer_source.origin; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.origin IS '产地';


--
-- Name: COLUMN mall_farmer_source.plant_date; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.plant_date IS '种植日期';


--
-- Name: COLUMN mall_farmer_source.harvest_date; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.harvest_date IS '采收日期';


--
-- Name: COLUMN mall_farmer_source.expire_date; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.expire_date IS '保质期截止日期 (生鲜类必填)';


--
-- Name: COLUMN mall_farmer_source.total_quantity; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.total_quantity IS '总库存量 (kg/件)';


--
-- Name: COLUMN mall_farmer_source.surplus_quantity; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.surplus_quantity IS '剩余库存量 (下单后实时扣减)';


--
-- Name: COLUMN mall_farmer_source.unit_price; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.unit_price IS '单价 (元/kg)';


--
-- Name: COLUMN mall_farmer_source.batch_price; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.batch_price IS '批量价';


--
-- Name: COLUMN mall_farmer_source.batch_quantity; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.batch_quantity IS '批量起订量';


--
-- Name: COLUMN mall_farmer_source.is_discount; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.is_discount IS '临期折扣标识: 0=否、1=是';


--
-- Name: COLUMN mall_farmer_source.product_images; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.product_images IS '产品图片 URL (多个用逗号分隔)';


--
-- Name: COLUMN mall_farmer_source.product_video; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.product_video IS '产品视频 URL (可选)';


--
-- Name: COLUMN mall_farmer_source.product_desc; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.product_desc IS '产品描述 (富文本)';


--
-- Name: COLUMN mall_farmer_source.logistics_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.logistics_type IS '支持物流: 1=快递、2=整车运输、3=两者都支持';


--
-- Name: COLUMN mall_farmer_source.freight_rule; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.freight_rule IS '运费规则';


--
-- Name: COLUMN mall_farmer_source.min_order_quantity; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.min_order_quantity IS '最小起订量 (kg/件)';


--
-- Name: COLUMN mall_farmer_source.audit_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.audit_status IS '审核状态: 0=待审核、1=已通过、2=已驳回';


--
-- Name: COLUMN mall_farmer_source.audit_user; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.audit_user IS '审核管理员 ID (关联 sys_user.user_id, user_type=3)';


--
-- Name: COLUMN mall_farmer_source.audit_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.audit_time IS '审核时间';


--
-- Name: COLUMN mall_farmer_source.audit_remark; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.audit_remark IS '审核意见 (audit_status=2时必填)';


--
-- Name: COLUMN mall_farmer_source.source_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.source_status IS '货源状态: 0=下架、1=在售、2=售罄、3=违规下架';


--
-- Name: COLUMN mall_farmer_source.view_count; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.view_count IS '浏览次数';


--
-- Name: COLUMN mall_farmer_source.collect_count; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.collect_count IS '收藏次数';


--
-- Name: COLUMN mall_farmer_source.create_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.create_time IS '发布时间';


--
-- Name: COLUMN mall_farmer_source.update_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_farmer_source.update_time IS '更新时间';


--
-- Name: mall_farmer_source_source_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_farmer_source_source_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_farmer_source_source_id_seq OWNER TO agri_root;

--
-- Name: mall_farmer_source_source_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_farmer_source_source_id_seq OWNED BY public.mall_farmer_source.source_id;


--
-- Name: mall_operation_log; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_operation_log (
    log_id bigint NOT NULL,
    user_id bigint NOT NULL,
    user_name character varying(50) NOT NULL,
    operation_type smallint NOT NULL,
    operation_module character varying(50) NOT NULL,
    operation_content character varying(500) NOT NULL,
    operation_obj_id character varying(50) NOT NULL,
    operation_ip character varying(50),
    operation_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mall_operation_log OWNER TO agri_root;

--
-- Name: TABLE mall_operation_log; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_operation_log IS '商城操作日志表';


--
-- Name: COLUMN mall_operation_log.operation_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_operation_log.operation_type IS '操作类型：1=货源发布, 2=求购发布, 3=订单创建, 4=售后申请, 5=审核操作';


--
-- Name: mall_operation_log_log_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_operation_log_log_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_operation_log_log_id_seq OWNER TO agri_root;

--
-- Name: mall_operation_log_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_operation_log_log_id_seq OWNED BY public.mall_operation_log.log_id;


--
-- Name: mall_order_aftersale; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_order_aftersale (
    aftersale_id bigint NOT NULL,
    order_id character varying(32) NOT NULL,
    item_id bigint,
    aftersale_type smallint NOT NULL,
    apply_amount numeric(12,2) NOT NULL,
    reason character varying(500) NOT NULL,
    proof_images character varying(500),
    apply_user bigint NOT NULL,
    apply_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    audit_status smallint DEFAULT 0,
    audit_user bigint,
    audit_time timestamp with time zone,
    audit_remark character varying(500),
    refund_time timestamp with time zone,
    refund_no character varying(50),
    aftersale_status smallint DEFAULT 1,
    create_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mall_order_aftersale OWNER TO agri_root;

--
-- Name: TABLE mall_order_aftersale; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_order_aftersale IS '订单售后表';


--
-- Name: COLUMN mall_order_aftersale.aftersale_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_aftersale.aftersale_type IS '售后类型：1=质量问题退款, 2=少发补发';


--
-- Name: COLUMN mall_order_aftersale.audit_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_aftersale.audit_status IS '审核状态：0=待审核, 1=已通过, 2=已驳回';


--
-- Name: COLUMN mall_order_aftersale.aftersale_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_aftersale.aftersale_status IS '售后状态：0=取消, 1=处理中, 2=已完成';


--
-- Name: mall_order_aftersale_aftersale_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_order_aftersale_aftersale_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_order_aftersale_aftersale_id_seq OWNER TO agri_root;

--
-- Name: mall_order_aftersale_aftersale_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_order_aftersale_aftersale_id_seq OWNED BY public.mall_order_aftersale.aftersale_id;


--
-- Name: mall_order_invoice; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_order_invoice (
    invoice_id bigint NOT NULL,
    invoice_no character varying(50) NOT NULL,
    order_id character varying(32) NOT NULL,
    buyer_id bigint NOT NULL,
    invoice_type smallint DEFAULT 0 NOT NULL,
    invoice_title character varying(100) NOT NULL,
    taxpayer_id character varying(50),
    invoice_amount numeric(12,2) NOT NULL,
    tax_rate numeric(5,2) DEFAULT 0.13 NOT NULL,
    tax_amount numeric(12,2) NOT NULL,
    invoice_content character varying(200) NOT NULL,
    invoice_status smallint DEFAULT 0 NOT NULL,
    apply_time timestamp with time zone,
    issue_time timestamp with time zone,
    invoice_url character varying(200),
    delivery_way smallint DEFAULT 1,
    logistics_company character varying(50),
    logistics_no character varying(50),
    receive_time timestamp with time zone,
    fail_reason character varying(500),
    red_invoice_no character varying(50),
    create_user bigint NOT NULL,
    create_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mall_order_invoice OWNER TO agri_root;

--
-- Name: TABLE mall_order_invoice; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_order_invoice IS '发票表';


--
-- Name: COLUMN mall_order_invoice.invoice_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_invoice.invoice_id IS '发票唯一 ID（自增主键）';


--
-- Name: COLUMN mall_order_invoice.order_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_invoice.order_id IS '关联订单 ID，一对一';


--
-- Name: COLUMN mall_order_invoice.invoice_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_invoice.invoice_type IS '发票类型：0=无, 1=普票, 2=专票';


--
-- Name: COLUMN mall_order_invoice.invoice_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_invoice.invoice_status IS '发票状态：0=待申请, 1=申请中, 2=已开具, 3=已邮寄, 4=已签收, 5=失败, 6=已冲红';


--
-- Name: COLUMN mall_order_invoice.delivery_way; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_invoice.delivery_way IS '发票交付方式：1=电子票, 2=纸质票';


--
-- Name: mall_order_invoice_invoice_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_order_invoice_invoice_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_order_invoice_invoice_id_seq OWNER TO agri_root;

--
-- Name: mall_order_invoice_invoice_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_order_invoice_invoice_id_seq OWNED BY public.mall_order_invoice.invoice_id;


--
-- Name: mall_order_item; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_order_item (
    item_id bigint NOT NULL,
    order_id character varying(32) NOT NULL,
    item_no character varying(32) NOT NULL,
    source_id bigint NOT NULL,
    product_name character varying(100) NOT NULL,
    product_spec character varying(100) NOT NULL,
    item_quantity numeric(15,2) NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    item_amount numeric(12,2) NOT NULL,
    discount_amount numeric(12,2) DEFAULT 0,
    freight_amount numeric(12,2) DEFAULT 0,
    item_pay_amount numeric(12,2) NOT NULL,
    delivery_status smallint DEFAULT 0,
    logistics_company character varying(50),
    logistics_no character varying(50),
    delivery_time timestamp with time zone,
    receive_time timestamp with time zone,
    create_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mall_order_item OWNER TO agri_root;

--
-- Name: TABLE mall_order_item; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_order_item IS '订单明细表';


--
-- Name: COLUMN mall_order_item.delivery_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_item.delivery_status IS '明细发货状态：0=未发, 1=已发, 2=已收, 3=拒收';


--
-- Name: mall_order_item_item_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_order_item_item_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_order_item_item_id_seq OWNER TO agri_root;

--
-- Name: mall_order_item_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_order_item_item_id_seq OWNED BY public.mall_order_item.item_id;


--
-- Name: mall_order_main; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_order_main (
    order_id character varying(32) NOT NULL,
    buyer_id bigint NOT NULL,
    seller_id bigint NOT NULL,
    source_id bigint NOT NULL,
    demand_id bigint,
    match_id bigint,
    order_type smallint DEFAULT 1,
    order_status smallint DEFAULT 0,
    payment_status smallint DEFAULT 0,
    delivery_status smallint DEFAULT 0,
    total_quantity numeric(15,2) NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    discount_amount numeric(12,2) DEFAULT 0,
    freight_amount numeric(12,2) DEFAULT 0,
    tax_amount numeric(12,2) DEFAULT 0,
    pay_amount numeric(12,2) NOT NULL,
    payment_type smallint,
    payment_time timestamp without time zone,
    payment_no character varying(50),
    delivery_type smallint NOT NULL,
    logistics_company character varying(50),
    logistics_no character varying(50),
    receiver_address_id bigint NOT NULL,
    delivery_time timestamp without time zone,
    receive_time timestamp without time zone,
    order_remark character varying(500),
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mall_order_main OWNER TO agri_root;

--
-- Name: TABLE mall_order_main; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_order_main IS '订单主表';


--
-- Name: COLUMN mall_order_main.order_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.order_id IS '订单编号 (ORD+年月日+6位随机数)';


--
-- Name: COLUMN mall_order_main.buyer_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.buyer_id IS '买家 ID';


--
-- Name: COLUMN mall_order_main.seller_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.seller_id IS '卖家 ID';


--
-- Name: COLUMN mall_order_main.source_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.source_id IS '关联货源 ID';


--
-- Name: COLUMN mall_order_main.demand_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.demand_id IS '关联求购 ID (可选)';


--
-- Name: COLUMN mall_order_main.match_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.match_id IS '关联匹配 ID (可选)';


--
-- Name: COLUMN mall_order_main.order_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.order_type IS '订单类型: 1=普通订单、2=匹配订单';


--
-- Name: COLUMN mall_order_main.order_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.order_status IS '订单状态: 0=待付款、1=待发货、2=待收货、3=已完成、4=已取消、5=售后中';


--
-- Name: COLUMN mall_order_main.payment_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.payment_status IS '支付状态: 0=未支付、1=部分支付、2=已支付、3=已退款';


--
-- Name: COLUMN mall_order_main.delivery_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.delivery_status IS '发货状态: 0=未发货、1=部分发货、2=已发货、3=已收货';


--
-- Name: COLUMN mall_order_main.total_quantity; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.total_quantity IS '订单总数量 (kg/件)';


--
-- Name: COLUMN mall_order_main.unit_price; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.unit_price IS '订单单价 (元/kg)';


--
-- Name: COLUMN mall_order_main.total_amount; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.total_amount IS '订单总金额 (未扣除折扣前)';


--
-- Name: COLUMN mall_order_main.discount_amount; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.discount_amount IS '折扣总金额';


--
-- Name: COLUMN mall_order_main.freight_amount; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.freight_amount IS '运费金额';


--
-- Name: COLUMN mall_order_main.tax_amount; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.tax_amount IS '税额';


--
-- Name: COLUMN mall_order_main.pay_amount; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.pay_amount IS '实付金额';


--
-- Name: COLUMN mall_order_main.payment_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.payment_type IS '支付方式: 1=在线支付、2=货到付款、3=银行转账';


--
-- Name: COLUMN mall_order_main.payment_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.payment_time IS '支付时间';


--
-- Name: COLUMN mall_order_main.payment_no; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.payment_no IS '支付单号';


--
-- Name: COLUMN mall_order_main.delivery_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.delivery_type IS '配送方式: 1=快递、2=整车运输、3=自提';


--
-- Name: COLUMN mall_order_main.logistics_company; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.logistics_company IS '物流公司';


--
-- Name: COLUMN mall_order_main.logistics_no; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.logistics_no IS '物流单号';


--
-- Name: COLUMN mall_order_main.receiver_address_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.receiver_address_id IS '收货地址 ID';


--
-- Name: COLUMN mall_order_main.delivery_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.delivery_time IS '发货时间';


--
-- Name: COLUMN mall_order_main.receive_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.receive_time IS '收货时间';


--
-- Name: COLUMN mall_order_main.order_remark; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.order_remark IS '订单备注';


--
-- Name: COLUMN mall_order_main.create_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.create_time IS '订单创建时间';


--
-- Name: COLUMN mall_order_main.update_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_order_main.update_time IS '订单更新时间';


--
-- Name: mall_product_category; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_product_category (
    category_id integer NOT NULL,
    parent_id integer DEFAULT 0,
    category_name character varying(50) NOT NULL,
    category_code character varying(30) NOT NULL,
    category_icon character varying(200),
    sort integer DEFAULT 0,
    status smallint DEFAULT 1,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mall_product_category OWNER TO agri_root;

--
-- Name: TABLE mall_product_category; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_product_category IS '农产品品类表';


--
-- Name: COLUMN mall_product_category.category_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_product_category.category_id IS '品类 ID (自增, 如 1-粮食作物、101-小麦)';


--
-- Name: COLUMN mall_product_category.parent_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_product_category.parent_id IS '父品类 ID: 0=一级品类, 非0=二级/三级品类 (如小麦父ID=1)';


--
-- Name: COLUMN mall_product_category.category_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_product_category.category_name IS '品类名称 (如 “粮食作物”“小麦”, 无重复)';


--
-- Name: COLUMN mall_product_category.category_code; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_product_category.category_code IS '品类编码 (如 "GRAIN-WHEAT", 接口传输用)';


--
-- Name: COLUMN mall_product_category.category_icon; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_product_category.category_icon IS '品类图标 URL (前端分类展示)';


--
-- Name: COLUMN mall_product_category.sort; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_product_category.sort IS '排序权重 (值越小越靠前)';


--
-- Name: COLUMN mall_product_category.status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_product_category.status IS '状态: 0=停用 (不再新增货源)、1=启用';


--
-- Name: COLUMN mall_product_category.create_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_product_category.create_time IS '创建时间';


--
-- Name: COLUMN mall_product_category.update_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_product_category.update_time IS '更新时间';


--
-- Name: mall_product_category_category_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_product_category_category_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_product_category_category_id_seq OWNER TO agri_root;

--
-- Name: mall_product_category_category_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_product_category_category_id_seq OWNED BY public.mall_product_category.category_id;


--
-- Name: mall_product_price_stat; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_product_price_stat (
    stat_id bigint NOT NULL,
    category_id integer NOT NULL,
    product_name character varying(50) NOT NULL,
    stat_date date NOT NULL,
    avg_price numeric(10,2) NOT NULL,
    max_price numeric(10,2) NOT NULL,
    min_price numeric(10,2) NOT NULL,
    price_trend smallint NOT NULL,
    trend_rate numeric(5,2),
    supply_quantity numeric(15,2) NOT NULL,
    demand_quantity numeric(15,2) NOT NULL,
    create_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mall_product_price_stat OWNER TO agri_root;

--
-- Name: TABLE mall_product_price_stat; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_product_price_stat IS '农产品价格统计表';


--
-- Name: COLUMN mall_product_price_stat.price_trend; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_product_price_stat.price_trend IS '价格趋势：0=持平, 1=上涨, 2=下跌';


--
-- Name: COLUMN mall_product_price_stat.trend_rate; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_product_price_stat.trend_rate IS '涨跌幅度（%）';


--
-- Name: mall_product_price_stat_stat_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_product_price_stat_stat_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_product_price_stat_stat_id_seq OWNER TO agri_root;

--
-- Name: mall_product_price_stat_stat_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_product_price_stat_stat_id_seq OWNED BY public.mall_product_price_stat.stat_id;


--
-- Name: mall_shopping_cart; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_shopping_cart (
    cart_id bigint NOT NULL,
    user_id bigint NOT NULL,
    source_id bigint NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mall_shopping_cart OWNER TO agri_root;

--
-- Name: mall_shopping_cart_cart_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_shopping_cart_cart_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_shopping_cart_cart_id_seq OWNER TO agri_root;

--
-- Name: mall_shopping_cart_cart_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_shopping_cart_cart_id_seq OWNED BY public.mall_shopping_cart.cart_id;


--
-- Name: mall_supply_demand_match; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_supply_demand_match (
    match_id bigint NOT NULL,
    match_no character varying(32) NOT NULL,
    demand_id bigint NOT NULL,
    source_id bigint NOT NULL,
    buyer_id bigint NOT NULL,
    seller_id bigint NOT NULL,
    match_score integer NOT NULL,
    match_quantity numeric(15,2) NOT NULL,
    match_price numeric(10,2) NOT NULL,
    match_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    match_type smallint DEFAULT 1,
    match_status smallint DEFAULT 0,
    confirm_time timestamp without time zone,
    cancel_time timestamp without time zone,
    cancel_reason character varying(500),
    order_id character varying(32),
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.mall_supply_demand_match OWNER TO agri_root;

--
-- Name: TABLE mall_supply_demand_match; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_supply_demand_match IS '供需匹配记录表';


--
-- Name: COLUMN mall_supply_demand_match.match_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.match_id IS '匹配 ID (自增)';


--
-- Name: COLUMN mall_supply_demand_match.match_no; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.match_no IS '匹配编号 (MAT+年月日+6位随机数)';


--
-- Name: COLUMN mall_supply_demand_match.demand_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.demand_id IS '关联求购 ID';


--
-- Name: COLUMN mall_supply_demand_match.source_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.source_id IS '关联货源 ID';


--
-- Name: COLUMN mall_supply_demand_match.buyer_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.buyer_id IS '买家 ID (冗余)';


--
-- Name: COLUMN mall_supply_demand_match.seller_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.seller_id IS '卖家 ID (冗余)';


--
-- Name: COLUMN mall_supply_demand_match.match_score; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.match_score IS '匹配度 (1-100分)';


--
-- Name: COLUMN mall_supply_demand_match.match_quantity; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.match_quantity IS '匹配数量';


--
-- Name: COLUMN mall_supply_demand_match.match_price; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.match_price IS '匹配价格';


--
-- Name: COLUMN mall_supply_demand_match.match_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.match_time IS '匹配时间';


--
-- Name: COLUMN mall_supply_demand_match.match_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.match_type IS '匹配类型: 1=系统自动、2=人工匹配';


--
-- Name: COLUMN mall_supply_demand_match.match_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.match_status IS '状态: 0=待确认、1=已确认、2=已下单、3=已取消';


--
-- Name: COLUMN mall_supply_demand_match.confirm_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.confirm_time IS '确认时间 (match_status=1时必填)';


--
-- Name: COLUMN mall_supply_demand_match.cancel_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.cancel_time IS '取消时间 (match_status=3时必填)';


--
-- Name: COLUMN mall_supply_demand_match.cancel_reason; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.cancel_reason IS '取消原因 (match_status=3时必填)';


--
-- Name: COLUMN mall_supply_demand_match.order_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.order_id IS '关联订单 ID (match_status=2时必填)';


--
-- Name: COLUMN mall_supply_demand_match.create_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.create_time IS '创建时间';


--
-- Name: COLUMN mall_supply_demand_match.update_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_supply_demand_match.update_time IS '更新时间';


--
-- Name: mall_supply_demand_match_match_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_supply_demand_match_match_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_supply_demand_match_match_id_seq OWNER TO agri_root;

--
-- Name: mall_supply_demand_match_match_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_supply_demand_match_match_id_seq OWNED BY public.mall_supply_demand_match.match_id;


--
-- Name: mall_user_collection; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_user_collection (
    collection_id bigint NOT NULL,
    user_id bigint NOT NULL,
    collection_type smallint NOT NULL,
    source_id bigint,
    demand_id bigint,
    collection_name character varying(100) NOT NULL,
    collection_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    is_valid smallint DEFAULT 1,
    cancel_time timestamp with time zone
);


ALTER TABLE public.mall_user_collection OWNER TO agri_root;

--
-- Name: TABLE mall_user_collection; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_user_collection IS '用户收藏表';


--
-- Name: COLUMN mall_user_collection.collection_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_collection.collection_type IS '收藏类型：1=货源收藏, 2=求购收藏';


--
-- Name: COLUMN mall_user_collection.is_valid; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_collection.is_valid IS '是否有效：0=已取消, 1=有效';


--
-- Name: mall_user_collection_collection_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_user_collection_collection_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_user_collection_collection_id_seq OWNER TO agri_root;

--
-- Name: mall_user_collection_collection_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_user_collection_collection_id_seq OWNED BY public.mall_user_collection.collection_id;


--
-- Name: mall_user_coupon; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_user_coupon (
    user_coupon_id bigint NOT NULL,
    rule_id bigint NOT NULL,
    user_id bigint NOT NULL,
    coupon_no character varying(32) NOT NULL,
    obtain_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    valid_start_time timestamp without time zone NOT NULL,
    valid_end_time timestamp without time zone NOT NULL,
    use_status smallint DEFAULT 0 NOT NULL,
    use_time timestamp without time zone,
    order_id character varying(32),
    actual_discount numeric(12,2),
    expire_remind_time timestamp without time zone
);


ALTER TABLE public.mall_user_coupon OWNER TO agri_root;

--
-- Name: TABLE mall_user_coupon; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_user_coupon IS '用户优惠券表';


--
-- Name: COLUMN mall_user_coupon.user_coupon_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_coupon.user_coupon_id IS '用户优惠券 ID (自增主键)';


--
-- Name: COLUMN mall_user_coupon.rule_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_coupon.rule_id IS '关联优惠券规则 ID (mall_coupon_rule.rule_id)';


--
-- Name: COLUMN mall_user_coupon.user_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_coupon.user_id IS '领取用户 ID (关联 sys_user.user_id)';


--
-- Name: COLUMN mall_user_coupon.coupon_no; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_coupon.coupon_no IS '优惠券编号 (生成规则: CPN+年月日+8位随机数)';


--
-- Name: COLUMN mall_user_coupon.obtain_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_coupon.obtain_time IS '领取时间';


--
-- Name: COLUMN mall_user_coupon.valid_start_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_coupon.valid_start_time IS '有效期开始时间 (继承规则的 valid_start_time)';


--
-- Name: COLUMN mall_user_coupon.valid_end_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_coupon.valid_end_time IS '有效期结束时间 (继承规则的 valid_end_time)';


--
-- Name: COLUMN mall_user_coupon.use_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_coupon.use_status IS '使用状态: 0=未使用、1=已使用、2=已过期、3=已作废(管理员操作)';


--
-- Name: COLUMN mall_user_coupon.use_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_coupon.use_time IS '使用时间 (use_status=1时必填)';


--
-- Name: COLUMN mall_user_coupon.order_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_coupon.order_id IS '关联订单 ID (use_status=1时必填)';


--
-- Name: COLUMN mall_user_coupon.actual_discount; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_coupon.actual_discount IS '实际优惠金额 (使用时计算)';


--
-- Name: COLUMN mall_user_coupon.expire_remind_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_coupon.expire_remind_time IS '过期提醒时间 (如有效期前1天)';


--
-- Name: mall_user_coupon_user_coupon_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_user_coupon_user_coupon_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_user_coupon_user_coupon_id_seq OWNER TO agri_root;

--
-- Name: mall_user_coupon_user_coupon_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_user_coupon_user_coupon_id_seq OWNED BY public.mall_user_coupon.user_coupon_id;


--
-- Name: mall_user_follow; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_user_follow (
    follow_id bigint NOT NULL,
    user_id bigint NOT NULL,
    seller_id bigint NOT NULL,
    follow_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    follow_status smallint DEFAULT 1 NOT NULL,
    cancel_time timestamp with time zone,
    seller_name character varying(100) NOT NULL,
    source_count integer DEFAULT 0,
    avg_score numeric(3,2) DEFAULT 5.00,
    follow_remark character varying(200)
);


ALTER TABLE public.mall_user_follow OWNER TO agri_root;

--
-- Name: TABLE mall_user_follow; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_user_follow IS '用户关注店铺表';


--
-- Name: COLUMN mall_user_follow.follow_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_follow.follow_status IS '关注状态：1=有效, 0=无效';


--
-- Name: mall_user_follow_follow_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_user_follow_follow_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_user_follow_follow_id_seq OWNER TO agri_root;

--
-- Name: mall_user_follow_follow_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_user_follow_follow_id_seq OWNED BY public.mall_user_follow.follow_id;


--
-- Name: mall_user_footprint; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.mall_user_footprint (
    footprint_id bigint NOT NULL,
    user_id bigint NOT NULL,
    view_type smallint NOT NULL,
    view_obj_id bigint NOT NULL,
    view_obj_name character varying(100) NOT NULL,
    view_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    view_duration integer DEFAULT 0,
    view_ip character varying(50),
    view_device character varying(100),
    is_deleted smallint DEFAULT 0 NOT NULL,
    delete_time timestamp with time zone
);


ALTER TABLE public.mall_user_footprint OWNER TO agri_root;

--
-- Name: TABLE mall_user_footprint; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.mall_user_footprint IS '用户足迹表';


--
-- Name: COLUMN mall_user_footprint.view_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_footprint.view_type IS '浏览类型：1=货源详情, 2=求购详情, 3=社区内容';


--
-- Name: COLUMN mall_user_footprint.view_duration; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_footprint.view_duration IS '浏览时长（单位：秒）';


--
-- Name: COLUMN mall_user_footprint.is_deleted; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.mall_user_footprint.is_deleted IS '是否删除：0=正常, 1=已删除';


--
-- Name: mall_user_footprint_footprint_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.mall_user_footprint_footprint_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mall_user_footprint_footprint_id_seq OWNER TO agri_root;

--
-- Name: mall_user_footprint_footprint_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.mall_user_footprint_footprint_id_seq OWNED BY public.mall_user_footprint.footprint_id;


--
-- Name: prediction_logs; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.prediction_logs (
    id integer NOT NULL,
    task_name character varying(100) NOT NULL,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone,
    status character varying(20) NOT NULL,
    products_count integer DEFAULT 0,
    predictions_count integer DEFAULT 0,
    error_message text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.prediction_logs OWNER TO agri_root;

--
-- Name: TABLE prediction_logs; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.prediction_logs IS '预测任务执行日志表';


--
-- Name: COLUMN prediction_logs.task_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.prediction_logs.task_name IS '任务名称';


--
-- Name: COLUMN prediction_logs.start_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.prediction_logs.start_time IS '开始时间';


--
-- Name: COLUMN prediction_logs.end_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.prediction_logs.end_time IS '结束时间';


--
-- Name: COLUMN prediction_logs.status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.prediction_logs.status IS '状态（running/success/failed）';


--
-- Name: COLUMN prediction_logs.products_count; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.prediction_logs.products_count IS '处理的产品数量';


--
-- Name: COLUMN prediction_logs.predictions_count; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.prediction_logs.predictions_count IS '生成的预测数量';


--
-- Name: COLUMN prediction_logs.error_message; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.prediction_logs.error_message IS '错误信息';


--
-- Name: COLUMN prediction_logs.created_at; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.prediction_logs.created_at IS '创建时间';


--
-- Name: prediction_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.prediction_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prediction_logs_id_seq OWNER TO agri_root;

--
-- Name: prediction_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.prediction_logs_id_seq OWNED BY public.prediction_logs.id;


--
-- Name: price_forecasts; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.price_forecasts (
    id integer NOT NULL,
    product_name character varying(100) NOT NULL,
    product_category character varying(50),
    region character varying(100) DEFAULT '全国'::character varying,
    forecast_period character varying(20) NOT NULL,
    forecast_month character varying(7) NOT NULL,
    predicted_price numeric(10,2) NOT NULL,
    confidence_level numeric(5,2),
    prediction_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    model_version character varying(50),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.price_forecasts OWNER TO agri_root;

--
-- Name: TABLE price_forecasts; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.price_forecasts IS '农产品价格预测数据表';


--
-- Name: price_forecasts_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.price_forecasts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.price_forecasts_id_seq OWNER TO agri_root;

--
-- Name: price_forecasts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.price_forecasts_id_seq OWNED BY public.price_forecasts.id;


--
-- Name: price_predictions; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.price_predictions (
    id integer NOT NULL,
    product_name character varying(100) NOT NULL,
    product_category character varying(50),
    region character varying(50) DEFAULT 'national'::character varying,
    prediction_type character varying(20) DEFAULT 'monthly'::character varying,
    prediction_date date NOT NULL,
    period_number integer NOT NULL,
    predicted_price numeric(10,2) NOT NULL,
    confidence_lower numeric(10,2),
    confidence_upper numeric(10,2),
    model_type character varying(20) DEFAULT 'arima'::character varying,
    accuracy_score numeric(5,2),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.price_predictions OWNER TO agri_root;

--
-- Name: TABLE price_predictions; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.price_predictions IS '价格预测结果表';


--
-- Name: COLUMN price_predictions.product_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.price_predictions.product_name IS '农产品名称';


--
-- Name: COLUMN price_predictions.product_category; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.price_predictions.product_category IS '产品类别';


--
-- Name: COLUMN price_predictions.region; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.price_predictions.region IS '区域（全国/地区）';


--
-- Name: COLUMN price_predictions.prediction_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.price_predictions.prediction_type IS '预测类型（monthly/annual）';


--
-- Name: COLUMN price_predictions.prediction_date; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.price_predictions.prediction_date IS '预测日期';


--
-- Name: COLUMN price_predictions.period_number; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.price_predictions.period_number IS '预测期数（1/2/3）';


--
-- Name: COLUMN price_predictions.predicted_price; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.price_predictions.predicted_price IS '预测价格';


--
-- Name: COLUMN price_predictions.confidence_lower; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.price_predictions.confidence_lower IS '置信区间下限';


--
-- Name: COLUMN price_predictions.confidence_upper; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.price_predictions.confidence_upper IS '置信区间上限';


--
-- Name: COLUMN price_predictions.model_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.price_predictions.model_type IS '模型类型（arima/lstm）';


--
-- Name: COLUMN price_predictions.accuracy_score; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.price_predictions.accuracy_score IS '准确度评分';


--
-- Name: COLUMN price_predictions.created_at; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.price_predictions.created_at IS '创建时间';


--
-- Name: COLUMN price_predictions.updated_at; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.price_predictions.updated_at IS '更新时间';


--
-- Name: price_predictions_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.price_predictions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.price_predictions_id_seq OWNER TO agri_root;

--
-- Name: price_predictions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.price_predictions_id_seq OWNED BY public.price_predictions.id;


--
-- Name: sys_cert_type; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.sys_cert_type (
    cert_type_id integer NOT NULL,
    cert_type_code character varying(30) NOT NULL,
    cert_type_name character varying(50) NOT NULL,
    apply_user_type smallint NOT NULL,
    cert_level smallint DEFAULT 1 NOT NULL,
    required_materials jsonb NOT NULL,
    optional_materials jsonb,
    audit_cycle character varying(50) DEFAULT '1-2 个工作日'::character varying NOT NULL,
    audit_user_role smallint DEFAULT 3 NOT NULL,
    cert_status_effect jsonb NOT NULL,
    cert_type_status smallint DEFAULT 1 NOT NULL,
    sort integer DEFAULT 0,
    create_user bigint NOT NULL,
    create_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sys_cert_type OWNER TO agri_root;

--
-- Name: TABLE sys_cert_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.sys_cert_type IS '认证类型配置表，定义认证分类与规则';


--
-- Name: COLUMN sys_cert_type.cert_type_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_cert_type.cert_type_id IS '认证类型 ID（自增主键，全局唯一）';


--
-- Name: COLUMN sys_cert_type.cert_type_code; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_cert_type.cert_type_code IS '认证类型编码（如 “ID_CARD”，接口传输用）';


--
-- Name: COLUMN sys_cert_type.cert_type_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_cert_type.cert_type_name IS '认证类型名称（如 “身份证实名认证”，前端展示用）';


--
-- Name: COLUMN sys_cert_type.apply_user_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_cert_type.apply_user_type IS '适用用户类型：1 = 农户、2 = 买家、3 = 全部用户';


--
-- Name: COLUMN sys_cert_type.cert_level; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_cert_type.cert_level IS '认证等级：1 = 基础认证、2 = 高级认证';


--
-- Name: COLUMN sys_cert_type.required_materials; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_cert_type.required_materials IS '必选材料清单 (JSON格式)';


--
-- Name: COLUMN sys_cert_type.optional_materials; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_cert_type.optional_materials IS '可选材料清单 (JSON格式)';


--
-- Name: COLUMN sys_cert_type.audit_cycle; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_cert_type.audit_cycle IS '审核周期（如 “1-2 个工作日”）';


--
-- Name: COLUMN sys_cert_type.audit_user_role; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_cert_type.audit_user_role IS '审核角色：3 = 平台管理员';


--
-- Name: COLUMN sys_cert_type.cert_status_effect; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_cert_type.cert_status_effect IS '认证通过后对用户状态的影响 (JSON格式)';


--
-- Name: COLUMN sys_cert_type.cert_type_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_cert_type.cert_type_status IS '认证类型状态：1 = 启用、0 = 停用';


--
-- Name: COLUMN sys_cert_type.sort; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_cert_type.sort IS '排序权重（值越小越靠前）';


--
-- Name: COLUMN sys_cert_type.create_user; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_cert_type.create_user IS '创建人 ID（关联sys_user.user_id）';


--
-- Name: COLUMN sys_cert_type.create_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_cert_type.create_time IS '配置创建时间';


--
-- Name: COLUMN sys_cert_type.update_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_cert_type.update_time IS '配置更新时间';


--
-- Name: sys_cert_type_cert_type_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.sys_cert_type_cert_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sys_cert_type_cert_type_id_seq OWNER TO agri_root;

--
-- Name: sys_cert_type_cert_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.sys_cert_type_cert_type_id_seq OWNED BY public.sys_cert_type.cert_type_id;


--
-- Name: sys_user; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.sys_user (
    user_id bigint NOT NULL,
    user_name character varying(50) NOT NULL,
    password character varying(100) NOT NULL,
    real_name character varying(50) NOT NULL,
    user_type smallint NOT NULL,
    id_card character varying(200) NOT NULL,
    phone character varying(20) NOT NULL,
    email character varying(100),
    avatar character varying(200),
    user_status smallint DEFAULT 1,
    cert_status smallint DEFAULT 0,
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_login_time timestamp without time zone
);


ALTER TABLE public.sys_user OWNER TO agri_root;

--
-- Name: TABLE sys_user; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.sys_user IS '用户基础信息表';


--
-- Name: COLUMN sys_user.user_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user.user_id IS '用户唯一ID (自增, 全局唯一, 如 1001-农户、2001-买家、3001-管理员)';


--
-- Name: COLUMN sys_user.user_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user.user_name IS '登录用户名 (如 "nonghu_zhang3", 唯一)';


--
-- Name: COLUMN sys_user.password; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user.password IS '密码 (BCrypt 加密, 不可明文)';


--
-- Name: COLUMN sys_user.real_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user.real_name IS '真实姓名 (用于实名认证、发票/物流信息)';


--
-- Name: COLUMN sys_user.user_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user.user_type IS '角色类型: 1=农户(卖家)、2=买家(采购方)、3=管理员';


--
-- Name: COLUMN sys_user.id_card; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user.id_card IS '身份证号 (AES-256 加密, 实名认证用)';


--
-- Name: COLUMN sys_user.phone; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user.phone IS '手机号 (登录验证、订单/物流短信通知)';


--
-- Name: COLUMN sys_user.email; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user.email IS '邮箱 (可选, 密码找回、邮件通知)';


--
-- Name: COLUMN sys_user.avatar; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user.avatar IS '头像 URL (个人中心展示)';


--
-- Name: COLUMN sys_user.user_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user.user_status IS '账号状态: 0=禁用、1=正常、2=待审核 (新用户未实名)';


--
-- Name: COLUMN sys_user.cert_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user.cert_status IS '认证状态: 0=未认证、1=已认证';


--
-- Name: COLUMN sys_user.create_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user.create_time IS '账号创建时间';


--
-- Name: COLUMN sys_user.update_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user.update_time IS '账号更新时间';


--
-- Name: COLUMN sys_user.last_login_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user.last_login_time IS '最后登录时间 (判断活跃度)';


--
-- Name: sys_user_address; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.sys_user_address (
    address_id bigint NOT NULL,
    user_id bigint NOT NULL,
    address_name character varying(50) NOT NULL,
    receiver character varying(50) NOT NULL,
    phone character varying(20) NOT NULL,
    province character varying(50) NOT NULL,
    city character varying(50) NOT NULL,
    county character varying(50) NOT NULL,
    detail_address character varying(200) NOT NULL,
    is_default smallint DEFAULT 0,
    postal_code character varying(20),
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sys_user_address OWNER TO agri_root;

--
-- Name: TABLE sys_user_address; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.sys_user_address IS '用户收货地址表';


--
-- Name: COLUMN sys_user_address.address_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_address.address_id IS '地址 ID (自增)';


--
-- Name: COLUMN sys_user_address.user_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_address.user_id IS '关联 sys_user.user_id (一个用户可多条地址)';


--
-- Name: COLUMN sys_user_address.address_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_address.address_name IS '地址名称 (如 “公司地址”“家里地址”, 用户区分用)';


--
-- Name: COLUMN sys_user_address.receiver; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_address.receiver IS '收货人姓名 (物流收件人)';


--
-- Name: COLUMN sys_user_address.phone; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_address.phone IS '收货人电话 (物流联系用)';


--
-- Name: COLUMN sys_user_address.province; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_address.province IS '省份 (标准化, 如 “河南省”)';


--
-- Name: COLUMN sys_user_address.city; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_address.city IS '城市 (如 “郑州市”)';


--
-- Name: COLUMN sys_user_address.county; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_address.county IS '区县 (如 “中牟县”)';


--
-- Name: COLUMN sys_user_address.detail_address; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_address.detail_address IS '详细地址 (如 “官渡镇 XX村 XX号”, 确保物流可达)';


--
-- Name: COLUMN sys_user_address.is_default; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_address.is_default IS '是否默认: 0=非默认、1=默认 (一个用户仅1条默认)';


--
-- Name: COLUMN sys_user_address.postal_code; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_address.postal_code IS '邮政编码 (可选)';


--
-- Name: COLUMN sys_user_address.create_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_address.create_time IS '地址创建时间';


--
-- Name: COLUMN sys_user_address.update_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_address.update_time IS '地址更新时间';


--
-- Name: sys_user_address_address_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.sys_user_address_address_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sys_user_address_address_id_seq OWNER TO agri_root;

--
-- Name: sys_user_address_address_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.sys_user_address_address_id_seq OWNED BY public.sys_user_address.address_id;


--
-- Name: sys_user_buyer; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.sys_user_buyer (
    buyer_id bigint NOT NULL,
    user_id bigint NOT NULL,
    buyer_type smallint DEFAULT 1,
    company_name character varying(100),
    company_address character varying(200),
    taxpayer_id character varying(50),
    purchase_scope character varying(200) NOT NULL,
    monthly_purchase numeric(15,2),
    default_address_id bigint,
    preferred_payment smallint DEFAULT 1,
    preferred_logistics character varying(200),
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sys_user_buyer OWNER TO agri_root;

--
-- Name: TABLE sys_user_buyer; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.sys_user_buyer IS '买家(采购方)信息扩展表';


--
-- Name: COLUMN sys_user_buyer.buyer_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_buyer.buyer_id IS '买家扩展 ID (自增)';


--
-- Name: COLUMN sys_user_buyer.user_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_buyer.user_id IS '关联 sys_user.user_id (仅user_type=2, 一对一)';


--
-- Name: COLUMN sys_user_buyer.buyer_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_buyer.buyer_type IS '买家类型: 1=个人买家、2=企业买家 (商超/加工厂)';


--
-- Name: COLUMN sys_user_buyer.company_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_buyer.company_name IS '企业名称 (仅 buyer_type=2必填, 发票抬头用)';


--
-- Name: COLUMN sys_user_buyer.company_address; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_buyer.company_address IS '企业地址 (仅 buyer_type=2必填)';


--
-- Name: COLUMN sys_user_buyer.taxpayer_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_buyer.taxpayer_id IS '纳税人识别号 (仅 buyer_type=2必填, 开增值税发票)';


--
-- Name: COLUMN sys_user_buyer.purchase_scope; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_buyer.purchase_scope IS '采购品类范围 (如 “小麦, 生鲜蔬菜”, 关联品类表)';


--
-- Name: COLUMN sys_user_buyer.monthly_purchase; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_buyer.monthly_purchase IS '月均采购量 (kg, 如 “50000.00”, 匹配优先级用)';


--
-- Name: COLUMN sys_user_buyer.default_address_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_buyer.default_address_id IS '默认收货地址 ID (关联 sys_user_address.address_id)';


--
-- Name: COLUMN sys_user_buyer.preferred_payment; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_buyer.preferred_payment IS '偏好支付方式: 1=在线支付、2=货到付款';


--
-- Name: COLUMN sys_user_buyer.preferred_logistics; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_buyer.preferred_logistics IS '偏好物流公司 (如 “顺丰, 德邦”, 下单优先推荐)';


--
-- Name: COLUMN sys_user_buyer.create_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_buyer.create_time IS '扩展信息创建时间';


--
-- Name: COLUMN sys_user_buyer.update_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_buyer.update_time IS '扩展信息更新时间';


--
-- Name: sys_user_buyer_buyer_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.sys_user_buyer_buyer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sys_user_buyer_buyer_id_seq OWNER TO agri_root;

--
-- Name: sys_user_buyer_buyer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.sys_user_buyer_buyer_id_seq OWNED BY public.sys_user_buyer.buyer_id;


--
-- Name: sys_user_cert_apply; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.sys_user_cert_apply (
    apply_id bigint NOT NULL,
    apply_no character varying(32) NOT NULL,
    user_id bigint NOT NULL,
    cert_type_id integer NOT NULL,
    cert_type_code character varying(30) NOT NULL,
    apply_info jsonb NOT NULL,
    apply_status smallint DEFAULT 0 NOT NULL,
    apply_time timestamp with time zone,
    audit_user_id bigint,
    audit_time timestamp with time zone,
    audit_remark character varying(500),
    reject_reason_type smallint,
    reapply_count integer DEFAULT 0 NOT NULL,
    last_reapply_time timestamp with time zone,
    cert_effect_time timestamp with time zone,
    cert_expire_time timestamp with time zone,
    cancel_time timestamp with time zone,
    cancel_reason character varying(500),
    create_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sys_user_cert_apply OWNER TO agri_root;

--
-- Name: TABLE sys_user_cert_apply; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.sys_user_cert_apply IS '用户认证申请表，记录用户认证申请核心数据';


--
-- Name: COLUMN sys_user_cert_apply.apply_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.apply_id IS '申请 ID（自增主键，全局唯一）';


--
-- Name: COLUMN sys_user_cert_apply.apply_no; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.apply_no IS '申请编号（如 “CERT2025111512345678”）';


--
-- Name: COLUMN sys_user_cert_apply.user_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.user_id IS '申请人 ID（关联sys_user.user_id）';


--
-- Name: COLUMN sys_user_cert_apply.cert_type_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.cert_type_id IS '关联认证类型 ID';


--
-- Name: COLUMN sys_user_cert_apply.cert_type_code; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.cert_type_code IS '认证类型编码（冗余存储）';


--
-- Name: COLUMN sys_user_cert_apply.apply_info; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.apply_info IS '认证核心信息 (JSON格式)';


--
-- Name: COLUMN sys_user_cert_apply.apply_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.apply_status IS '申请状态：0=待提交, 1=待审核, 2=审核通过, 3=审核驳回, 4=已撤销';


--
-- Name: COLUMN sys_user_cert_apply.apply_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.apply_time IS '申请提交时间';


--
-- Name: COLUMN sys_user_cert_apply.audit_user_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.audit_user_id IS '审核人 ID';


--
-- Name: COLUMN sys_user_cert_apply.audit_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.audit_time IS '审核时间';


--
-- Name: COLUMN sys_user_cert_apply.audit_remark; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.audit_remark IS '审核意见';


--
-- Name: COLUMN sys_user_cert_apply.reject_reason_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.reject_reason_type IS '驳回原因分类：1=材料模糊, 2=信息不一致, 3=材料缺失, 4=其他';


--
-- Name: COLUMN sys_user_cert_apply.reapply_count; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.reapply_count IS '重新申请次数';


--
-- Name: COLUMN sys_user_cert_apply.last_reapply_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.last_reapply_time IS '最后一次重新申请时间';


--
-- Name: COLUMN sys_user_cert_apply.cert_effect_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.cert_effect_time IS '认证生效时间';


--
-- Name: COLUMN sys_user_cert_apply.cert_expire_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.cert_expire_time IS '认证过期时间';


--
-- Name: COLUMN sys_user_cert_apply.cancel_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.cancel_time IS '撤销时间';


--
-- Name: COLUMN sys_user_cert_apply.cancel_reason; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.cancel_reason IS '撤销原因';


--
-- Name: COLUMN sys_user_cert_apply.create_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.create_time IS '记录创建时间';


--
-- Name: COLUMN sys_user_cert_apply.update_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_apply.update_time IS '记录更新时间';


--
-- Name: sys_user_cert_apply_apply_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.sys_user_cert_apply_apply_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sys_user_cert_apply_apply_id_seq OWNER TO agri_root;

--
-- Name: sys_user_cert_apply_apply_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.sys_user_cert_apply_apply_id_seq OWNED BY public.sys_user_cert_apply.apply_id;


--
-- Name: sys_user_cert_material; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.sys_user_cert_material (
    material_id bigint NOT NULL,
    apply_id bigint NOT NULL,
    material_type character varying(50) NOT NULL,
    material_name character varying(100) NOT NULL,
    material_url character varying(200) NOT NULL,
    material_format character varying(20) NOT NULL,
    material_size numeric(10,2) NOT NULL,
    material_status smallint DEFAULT 1 NOT NULL,
    upload_time timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    replace_material_id bigint,
    upload_user_id bigint NOT NULL
);


ALTER TABLE public.sys_user_cert_material OWNER TO agri_root;

--
-- Name: TABLE sys_user_cert_material; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.sys_user_cert_material IS '用户认证材料记录表，存储认证附件';


--
-- Name: COLUMN sys_user_cert_material.material_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_material.material_id IS '材料 ID（自增主键）';


--
-- Name: COLUMN sys_user_cert_material.apply_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_material.apply_id IS '关联认证申请 ID';


--
-- Name: COLUMN sys_user_cert_material.material_type; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_material.material_type IS '材料类型（如 “ID_CARD_FRONT”）';


--
-- Name: COLUMN sys_user_cert_material.material_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_material.material_name IS '材料名称（如 “身份证正面照（张三）”）';


--
-- Name: COLUMN sys_user_cert_material.material_url; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_material.material_url IS '材料存储 URL';


--
-- Name: COLUMN sys_user_cert_material.material_format; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_material.material_format IS '材料格式（如 “JPG”“PNG”）';


--
-- Name: COLUMN sys_user_cert_material.material_size; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_material.material_size IS '材料大小（单位：MB）';


--
-- Name: COLUMN sys_user_cert_material.material_status; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_material.material_status IS '材料状态：1 = 正常、0 = 无效';


--
-- Name: COLUMN sys_user_cert_material.upload_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_material.upload_time IS '材料上传时间';


--
-- Name: COLUMN sys_user_cert_material.replace_material_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_material.replace_material_id IS '替换前材料 ID';


--
-- Name: COLUMN sys_user_cert_material.upload_user_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_cert_material.upload_user_id IS '上传人 ID';


--
-- Name: sys_user_cert_material_material_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.sys_user_cert_material_material_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sys_user_cert_material_material_id_seq OWNER TO agri_root;

--
-- Name: sys_user_cert_material_material_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.sys_user_cert_material_material_id_seq OWNED BY public.sys_user_cert_material.material_id;


--
-- Name: sys_user_farmer; Type: TABLE; Schema: public; Owner: agri_root
--

CREATE TABLE public.sys_user_farmer (
    farmer_id bigint NOT NULL,
    user_id bigint NOT NULL,
    farm_name character varying(100),
    contact_person character varying(50),
    contact_phone character varying(20),
    bank_card_no character varying(200),
    bank_name character varying(100),
    qualification character varying(1000),
    create_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    update_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.sys_user_farmer OWNER TO agri_root;

--
-- Name: TABLE sys_user_farmer; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON TABLE public.sys_user_farmer IS '农户(卖家)信息扩展表';


--
-- Name: COLUMN sys_user_farmer.farmer_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_farmer.farmer_id IS '农户扩展 ID (自增)';


--
-- Name: COLUMN sys_user_farmer.user_id; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_farmer.user_id IS '关联 sys_user.user_id (仅user_type=1, 一对一)';


--
-- Name: COLUMN sys_user_farmer.farm_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_farmer.farm_name IS '农场/合作社名称 (货源展示用)';


--
-- Name: COLUMN sys_user_farmer.contact_person; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_farmer.contact_person IS '紧急联系人 (非农户本人)';


--
-- Name: COLUMN sys_user_farmer.contact_phone; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_farmer.contact_phone IS '紧急联系人电话';


--
-- Name: COLUMN sys_user_farmer.bank_card_no; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_farmer.bank_card_no IS '银行卡号 (AES-256 加密, 交易收款用)';


--
-- Name: COLUMN sys_user_farmer.bank_name; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_farmer.bank_name IS '开户银行 (如 “中国农业银行郑州中牟支行”)';


--
-- Name: COLUMN sys_user_farmer.qualification; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_farmer.qualification IS '资质证书 URL (绿色食品/有机认证, 提升货源竞争力)';


--
-- Name: COLUMN sys_user_farmer.create_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_farmer.create_time IS '扩展信息创建时间';


--
-- Name: COLUMN sys_user_farmer.update_time; Type: COMMENT; Schema: public; Owner: agri_root
--

COMMENT ON COLUMN public.sys_user_farmer.update_time IS '扩展信息更新时间';


--
-- Name: sys_user_farmer_farmer_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.sys_user_farmer_farmer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sys_user_farmer_farmer_id_seq OWNER TO agri_root;

--
-- Name: sys_user_farmer_farmer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.sys_user_farmer_farmer_id_seq OWNED BY public.sys_user_farmer.farmer_id;


--
-- Name: sys_user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: agri_root
--

CREATE SEQUENCE public.sys_user_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sys_user_user_id_seq OWNER TO agri_root;

--
-- Name: sys_user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: agri_root
--

ALTER SEQUENCE public.sys_user_user_id_seq OWNED BY public.sys_user.user_id;


--
-- Name: community_blacklist black_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_blacklist ALTER COLUMN black_id SET DEFAULT nextval('public.community_blacklist_black_id_seq'::regclass);


--
-- Name: community_categories category_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_categories ALTER COLUMN category_id SET DEFAULT nextval('public.community_categories_category_id_seq'::regclass);


--
-- Name: community_collects collect_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_collects ALTER COLUMN collect_id SET DEFAULT nextval('public.community_collects_collect_id_seq'::regclass);


--
-- Name: community_comments comment_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_comments ALTER COLUMN comment_id SET DEFAULT nextval('public.community_comments_comment_id_seq'::regclass);


--
-- Name: community_content content_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_content ALTER COLUMN content_id SET DEFAULT nextval('public.community_content_content_id_seq'::regclass);


--
-- Name: community_content_tags id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_content_tags ALTER COLUMN id SET DEFAULT nextval('public.community_content_tags_id_seq'::regclass);


--
-- Name: community_follows follow_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_follows ALTER COLUMN follow_id SET DEFAULT nextval('public.community_follows_follow_id_seq'::regclass);


--
-- Name: community_likes like_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_likes ALTER COLUMN like_id SET DEFAULT nextval('public.community_likes_like_id_seq'::regclass);


--
-- Name: community_qa_relation qa_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_qa_relation ALTER COLUMN qa_id SET DEFAULT nextval('public.community_qa_relation_qa_id_seq'::regclass);


--
-- Name: community_reports report_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_reports ALTER COLUMN report_id SET DEFAULT nextval('public.community_reports_report_id_seq'::regclass);


--
-- Name: community_tags tag_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_tags ALTER COLUMN tag_id SET DEFAULT nextval('public.community_tags_tag_id_seq'::regclass);


--
-- Name: community_violations violation_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_violations ALTER COLUMN violation_id SET DEFAULT nextval('public.community_violations_violation_id_seq'::regclass);


--
-- Name: financing_application application_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_application ALTER COLUMN application_id SET DEFAULT nextval('public.financing_application_application_id_seq'::regclass);


--
-- Name: financing_bank bank_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_bank ALTER COLUMN bank_id SET DEFAULT nextval('public.financing_bank_bank_id_seq'::regclass);


--
-- Name: financing_bank_approval approval_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_bank_approval ALTER COLUMN approval_id SET DEFAULT nextval('public.financing_bank_approval_approval_id_seq'::regclass);


--
-- Name: financing_credit_evaluation evaluation_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_credit_evaluation ALTER COLUMN evaluation_id SET DEFAULT nextval('public.financing_credit_evaluation_evaluation_id_seq'::regclass);


--
-- Name: financing_loan_type loan_type_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_loan_type ALTER COLUMN loan_type_id SET DEFAULT nextval('public.financing_loan_type_loan_type_id_seq'::regclass);


--
-- Name: financing_presale_plan plan_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_presale_plan ALTER COLUMN plan_id SET DEFAULT nextval('public.financing_presale_plan_plan_id_seq'::regclass);


--
-- Name: financing_presale_subscription subscription_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_presale_subscription ALTER COLUMN subscription_id SET DEFAULT nextval('public.financing_presale_subscription_subscription_id_seq'::regclass);


--
-- Name: financing_repayment_adjustment_request request_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_repayment_adjustment_request ALTER COLUMN request_id SET DEFAULT nextval('public.financing_repayment_adjustment_request_request_id_seq'::regclass);


--
-- Name: financing_repayment_schedule schedule_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_repayment_schedule ALTER COLUMN schedule_id SET DEFAULT nextval('public.financing_repayment_schedule_schedule_id_seq'::regclass);


--
-- Name: forecast_job_logs id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.forecast_job_logs ALTER COLUMN id SET DEFAULT nextval('public.forecast_job_logs_id_seq'::regclass);


--
-- Name: historical_prices id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.historical_prices ALTER COLUMN id SET DEFAULT nextval('public.historical_prices_id_seq'::regclass);


--
-- Name: mall_buyer_demand demand_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_buyer_demand ALTER COLUMN demand_id SET DEFAULT nextval('public.mall_buyer_demand_demand_id_seq'::regclass);


--
-- Name: mall_coupon_rule rule_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_coupon_rule ALTER COLUMN rule_id SET DEFAULT nextval('public.mall_coupon_rule_rule_id_seq'::regclass);


--
-- Name: mall_discount_activity activity_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_discount_activity ALTER COLUMN activity_id SET DEFAULT nextval('public.mall_discount_activity_activity_id_seq'::regclass);


--
-- Name: mall_farmer_source source_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_farmer_source ALTER COLUMN source_id SET DEFAULT nextval('public.mall_farmer_source_source_id_seq'::regclass);


--
-- Name: mall_operation_log log_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_operation_log ALTER COLUMN log_id SET DEFAULT nextval('public.mall_operation_log_log_id_seq'::regclass);


--
-- Name: mall_order_aftersale aftersale_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_aftersale ALTER COLUMN aftersale_id SET DEFAULT nextval('public.mall_order_aftersale_aftersale_id_seq'::regclass);


--
-- Name: mall_order_invoice invoice_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_invoice ALTER COLUMN invoice_id SET DEFAULT nextval('public.mall_order_invoice_invoice_id_seq'::regclass);


--
-- Name: mall_order_item item_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_item ALTER COLUMN item_id SET DEFAULT nextval('public.mall_order_item_item_id_seq'::regclass);


--
-- Name: mall_product_category category_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_product_category ALTER COLUMN category_id SET DEFAULT nextval('public.mall_product_category_category_id_seq'::regclass);


--
-- Name: mall_product_price_stat stat_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_product_price_stat ALTER COLUMN stat_id SET DEFAULT nextval('public.mall_product_price_stat_stat_id_seq'::regclass);


--
-- Name: mall_shopping_cart cart_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_shopping_cart ALTER COLUMN cart_id SET DEFAULT nextval('public.mall_shopping_cart_cart_id_seq'::regclass);


--
-- Name: mall_supply_demand_match match_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_supply_demand_match ALTER COLUMN match_id SET DEFAULT nextval('public.mall_supply_demand_match_match_id_seq'::regclass);


--
-- Name: mall_user_collection collection_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_collection ALTER COLUMN collection_id SET DEFAULT nextval('public.mall_user_collection_collection_id_seq'::regclass);


--
-- Name: mall_user_coupon user_coupon_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_coupon ALTER COLUMN user_coupon_id SET DEFAULT nextval('public.mall_user_coupon_user_coupon_id_seq'::regclass);


--
-- Name: mall_user_follow follow_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_follow ALTER COLUMN follow_id SET DEFAULT nextval('public.mall_user_follow_follow_id_seq'::regclass);


--
-- Name: mall_user_footprint footprint_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_footprint ALTER COLUMN footprint_id SET DEFAULT nextval('public.mall_user_footprint_footprint_id_seq'::regclass);


--
-- Name: prediction_logs id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.prediction_logs ALTER COLUMN id SET DEFAULT nextval('public.prediction_logs_id_seq'::regclass);


--
-- Name: price_forecasts id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.price_forecasts ALTER COLUMN id SET DEFAULT nextval('public.price_forecasts_id_seq'::regclass);


--
-- Name: price_predictions id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.price_predictions ALTER COLUMN id SET DEFAULT nextval('public.price_predictions_id_seq'::regclass);


--
-- Name: sys_cert_type cert_type_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_cert_type ALTER COLUMN cert_type_id SET DEFAULT nextval('public.sys_cert_type_cert_type_id_seq'::regclass);


--
-- Name: sys_user user_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user ALTER COLUMN user_id SET DEFAULT nextval('public.sys_user_user_id_seq'::regclass);


--
-- Name: sys_user_address address_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_address ALTER COLUMN address_id SET DEFAULT nextval('public.sys_user_address_address_id_seq'::regclass);


--
-- Name: sys_user_buyer buyer_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_buyer ALTER COLUMN buyer_id SET DEFAULT nextval('public.sys_user_buyer_buyer_id_seq'::regclass);


--
-- Name: sys_user_cert_apply apply_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_cert_apply ALTER COLUMN apply_id SET DEFAULT nextval('public.sys_user_cert_apply_apply_id_seq'::regclass);


--
-- Name: sys_user_cert_material material_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_cert_material ALTER COLUMN material_id SET DEFAULT nextval('public.sys_user_cert_material_material_id_seq'::regclass);


--
-- Name: sys_user_farmer farmer_id; Type: DEFAULT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_farmer ALTER COLUMN farmer_id SET DEFAULT nextval('public.sys_user_farmer_farmer_id_seq'::regclass);


--
-- Data for Name: community_blacklist; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.community_blacklist (black_id, blocker_id, blacked_user_id, black_reason, create_time) FROM stdin;
\.


--
-- Data for Name: community_categories; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.community_categories (category_id, parent_id, category_name, category_desc, sort_order, is_enabled, create_time, update_time) FROM stdin;
1	0	种植技术	农作物种植相关技术交流	1	1	2025-11-07 15:54:26.171205	2025-11-07 15:54:26.171205
101	1	小麦种植	小麦种植技术与经验分享	1	1	2025-11-07 15:54:26.171205	2025-11-07 15:54:26.171205
102	1	水稻种植	水稻种植技术与经验分享	2	1	2025-11-07 15:54:26.171205	2025-11-07 15:54:26.171205
2	0	养殖技术	畜牧养殖相关技术交流	2	1	2025-11-07 15:54:26.171205	2025-11-07 15:54:26.171205
201	2	家禽养殖	鸡鸭鹅等家禽养殖技术	1	1	2025-11-07 15:54:26.171205	2025-11-07 15:54:26.171205
3	0	市场行情	农产品市场价格与行情讨论	3	1	2025-11-07 15:54:26.171205	2025-11-07 15:54:26.171205
301	3	粮食价格	粮食作物价格行情	1	1	2025-11-07 15:54:26.171205	2025-11-07 15:54:26.171205
\.


--
-- Data for Name: community_collects; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.community_collects (collect_id, content_id, user_id, create_time) FROM stdin;
1	1	2	2025-11-17 12:54:44.181
2	1	3	2025-11-17 12:54:44.181
3	3	2	2025-11-17 12:54:44.181
4	6	56	2025-11-28 04:09:07.897343
5	10	56	2025-11-28 04:09:07.897343
6	23	56	2025-11-28 04:09:07.897343
7	7	57	2025-11-28 04:09:07.897343
8	15	57	2025-11-28 04:09:07.897343
9	9	51	2025-11-28 04:09:07.897343
10	13	51	2025-11-28 04:09:07.897343
11	16	52	2025-11-28 04:09:07.897343
12	19	52	2025-11-28 04:09:07.897343
\.


--
-- Data for Name: community_comments; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.community_comments (comment_id, content_id, commenter_id, parent_id, comment_text, like_count, audit_status, is_deleted, create_time) FROM stdin;
1	1	2	0	写得很好，很实用！	0	1	0	2025-11-17 12:54:44.105
2	1	3	0	感谢分享，学习了！	0	1	0	2025-11-17 12:54:44.106
3	2	1	0	看起来像是小麦锈病，建议使用三唑酮防治。	0	1	0	2025-11-17 12:54:44.106
4	3	2	0	选择优质品种、合理密植、科学施肥是关键。	0	1	0	2025-11-17 12:54:44.106
5	3	3	0	水肥管理很重要，要根据生长期调整。	0	1	0	2025-11-17 12:54:44.106
6	6	52	0	写得很详细，学习了！我今年也要试试这个方法。	8	1	0	2025-11-28 04:09:07.897343
7	6	56	0	请问底肥和追肥的比例是多少？	3	1	0	2025-11-28 04:09:07.897343
8	7	53	0	生物防治具体用什么方法？能详细说说吗？	6	1	0	2025-11-28 04:09:07.897343
9	8	51	0	目前我们这边一级小麦收购价2.8元/斤，二级2.6元/斤。	7	1	0	2025-11-28 04:09:07.897343
10	8	54	0	我们这边价格差不多，主要看水分和杂质含量。	5	1	0	2025-11-28 04:09:07.897343
11	9	55	0	智能温控系统大概多少钱？值得投资吗？	9	1	0	2025-11-28 04:09:07.897343
12	10	57	0	很实用的经验分享，收藏了！	12	1	0	2025-11-28 04:09:07.897343
13	10	51	0	请问病虫害防治主要防哪些病虫？	8	1	0	2025-11-28 04:09:07.897343
14	11	51	0	目前玉米价格比较稳定，预计短期内不会有大的波动。	6	1	0	2025-11-28 04:09:07.897343
15	11	52	0	我觉得春节前可能会小幅上涨，可以等等看。	8	1	0	2025-11-28 04:09:07.897343
16	12	53	0	有机认证怎么申请？流程复杂吗？	11	1	0	2025-11-28 04:09:07.897343
17	13	59	0	有机认证需要多长时间？费用大概多少？	10	1	0	2025-11-28 04:09:07.897343
18	14	51	0	我们有有机认证，可以长期供货，已私信联系方式。	8	1	0	2025-11-28 04:09:07.897343
19	14	53	0	我们也有有机蔬菜基地，品种齐全，欢迎合作。	7	1	0	2025-11-28 04:09:07.897343
20	15	54	0	滴灌系统投资大吗？多久能回本？	12	1	0	2025-11-28 04:09:07.897343
21	16	55	0	柑橘的修剪时间很重要，冬季修剪效果最好。	9	1	0	2025-11-28 04:09:07.897343
22	17	51	0	最近叶菜类价格确实涨了不少，主要是天气原因。	10	1	0	2025-11-28 04:09:07.897343
23	17	52	0	根茎类价格相对稳定，建议可以多储备一些。	8	1	0	2025-11-28 04:09:07.897343
24	18	53	0	定期保养真的很重要，我的农机用了10年还很好用。	11	1	0	2025-11-28 04:09:07.897343
25	19	54	0	有机肥发酵需要注意什么？	10	1	0	2025-11-28 04:09:07.897343
26	20	51	0	我们可以长期供应优质大米，有检测报告。	7	1	0	2025-11-28 04:09:07.897343
27	20	55	0	我们也可以供应，价格合理，欢迎洽谈。	6	1	0	2025-11-28 04:09:07.897343
28	21	52	0	主要是控制温度和湿度，温度60-70度最好。	8	1	0	2025-11-28 04:09:07.897343
29	22	53	0	西红柿整枝很关键，直接影响产量和品质。	9	1	0	2025-11-28 04:09:07.897343
30	23	51	0	物联网监测系统好用吗？推荐哪个品牌？	15	1	0	2025-11-28 04:09:07.897343
31	23	54	0	我用的是XX品牌，很稳定，手机APP就能查看数据。	12	1	0	2025-11-28 04:09:07.897343
32	24	53	0	我们有大量脐橙，70-80mm规格，5.5元/斤。	8	1	0	2025-11-28 04:09:07.897343
33	24	54	0	我们的价格是5.8元/斤，品质保证。	7	1	0	2025-11-28 04:09:07.897343
34	25	55	0	黄瓜的水肥管理很重要，不能缺水。	9	1	0	2025-11-28 04:09:07.897343
35	25	51	0	搭架要及时，否则影响黄瓜生长。	8	1	0	2025-11-28 04:09:07.897343
\.


--
-- Data for Name: community_content; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.community_content (content_id, author_id, category_id, content_type, content_title, content_text, content_cover, view_count, like_count, comment_count, collect_count, share_count, audit_status, is_deleted, create_time, update_time) FROM stdin;
4	3	201	1	家禽养殖经验分享	养殖家禽多年，分享一些实用经验。饲料配比、疾病预防、环境管理都很重要。	\N	0	0	0	0	0	1	0	2025-11-17 12:54:44.054	2025-11-28 04:09:07.897343
5	2	301	1	今年小麦价格行情分析	根据市场调研，今年小麦价格整体稳定，局部地区有小幅上涨。	\N	0	0	0	0	0	1	0	2025-11-17 12:54:44.054	2025-11-28 04:09:07.897343
3	1	102	3	水稻种植中如何提高产量？	想请教各位老师，水稻种植过程中有哪些关键技术可以提高产量？	\N	8	2	2	1	0	1	0	2025-11-17 12:54:44.054	2025-11-28 04:09:07.897343
2	2	101	2	小麦病虫害防治求助	我的小麦地出现了一些病虫害，叶子发黄，有斑点，请问这是什么病？应该如何防治？	\N	6	1	1	0	0	1	0	2025-11-17 12:54:44.054	2025-11-28 04:09:07.897343
1	1	101	1	冬小麦高产种植技术分享	经过多年实践，总结了一套冬小麦高产种植技术。首先要选择优质品种，其次要注意播种时间和密度，最后要做好田间管理。	\N	22	2	2	2	0	1	0	2025-11-17 12:54:44.054	2025-11-28 04:09:07.897343
6	51	101	1	小麦高产种植技术分享	今年我们农场的小麦亩产达到了600公斤，主要采用了以下几个技术要点：1. 选用优质抗病品种；2. 合理密植，每亩3.5万株；3. 科学施肥，底肥+追肥结合；4. 及时防治病虫害。特别是在灌浆期要保证充足的水分供应，这对提高产量非常关键。	wheat-field.jpg	234	2	2	1	8	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
7	52	102	1	水稻病虫害综合防治经验	水稻种植过程中，病虫害防治是关键。我总结了几点经验：1. 选用抗病品种是基础；2. 合理轮作，避免连作；3. 生物防治优先，化学防治为辅；4. 关键时期用药，如分蘖期、孕穗期。今年采用这些方法后，农药使用量减少了30%，但产量反而提高了。	rice-field.jpg	189	2	1	1	5	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
8	56	101	2	求助：小麦收购价格咨询	各位农友好，我是做粮食收购的。想了解一下今年小麦的收购价格行情，目前市场价大概是多少？质量要求是什么？希望有经验的朋友能分享一下，谢谢！	\N	156	0	2	0	2	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
9	53	201	1	大棚蔬菜种植温度控制技巧	大棚蔬菜种植，温度控制很重要。白天保持25-30度，夜间15-18度最适宜。冬季要注意保温，可以采用多层覆盖；夏季要注意通风降温，避免高温危害。我用的是智能温控系统，效果很好，蔬菜品质明显提升。	greenhouse.jpg	298	1	1	1	12	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
10	54	301	1	脐橙种植管理全流程	种植脐橙5年了，分享一下全流程管理经验：1. 选地：坡地排水好；2. 定植：春季3-4月最佳；3. 施肥：有机肥为主，化肥为辅；4. 修剪：保持通风透光；5. 病虫害防治：预防为主；6. 采收：11-12月，八成熟采摘。	orange-tree.jpg	412	1	2	1	15	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
11	57	3	3	请问现在玉米价格走势如何？	最近想采购一批玉米，不知道现在的价格走势如何？是涨还是跌？什么时候采购比较合适？请懂行的朋友指点一下，谢谢！	\N	178	0	2	0	3	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
12	55	102	1	有机大米种植技术要点	有机大米种植要点：1. 土壤改良：增施有机肥；2. 品种选择：抗病性强；3. 轮作：避免连作障碍；4. 病虫害防治：生物防治为主；5. 不使用化学农药和化肥；6. 获得有机认证。虽然成本高，但价格也好。	organic-rice.jpg	267	0	1	0	9	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
13	51	201	1	有机蔬菜种植技术分享	有机蔬菜种植要点：1. 土壤改良：增施有机肥，改善土壤结构；2. 品种选择：抗病性强的品种；3. 轮作：避免连作障碍；4. 病虫害防治：生物防治为主；5. 不使用化学农药和化肥；6. 获得有机认证。虽然成本高，但价格也好。	organic-vegetable.jpg	456	2	1	1	14	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
14	58	2	2	寻找优质有机蔬菜供应商	我们是连锁超市，需要长期稳定的有机蔬菜供应。要求：1. 有有机认证；2. 品种齐全；3. 供货稳定；4. 价格合理。有意向的农友请联系，可以长期合作。	\N	312	0	2	0	6	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
15	52	1	1	节水灌溉技术应用	节水灌溉技术分享：1. 滴灌：适合大田作物，节水50%；2. 喷灌：适合蔬菜，节水30%；3. 微喷：适合果树，节水40%。我们农场采用滴灌系统，不仅节水，还能精准施肥，作物长势明显改善。	irrigation.jpg	289	1	1	1	9	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
16	53	301	1	柑橘种植管理技术	柑橘种植管理：1. 建园：选择避风向阳的坡地；2. 定植：春季2-3月；3. 施肥：春夏秋三次施肥；4. 修剪：冬季修剪，保持通风透光；5. 保花保果：喷施叶面肥；6. 病虫害防治：综合防治；7. 采收：适时采收，分级包装。	citrus-orchard.jpg	367	1	1	1	11	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
17	59	2	3	蔬菜价格行情分析	最近蔬菜价格波动比较大，想了解一下各位对后期行情的看法。叶菜类会继续涨吗？根茎类价格稳定吗？欢迎大家分享观点。	\N	398	0	2	0	8	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
18	54	1	1	农机使用与维护经验	农机使用维护要点：1. 使用前检查：油、水、电；2. 正确操作：按说明书操作；3. 定期保养：更换机油、清洁滤芯；4. 季节性维护：冬季防冻，夏季防晒；5. 故障排除：及时维修。正确使用维护可延长农机寿命。	farm-machinery.jpg	256	0	1	0	8	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
19	55	1	1	土壤改良技术分享	土壤改良方法：1. 增施有机肥：改善土壤结构；2. 深耕：打破犁底层；3. 种植绿肥：增加有机质；4. 合理轮作：避免连作障碍；5. 秸秆还田：增加土壤肥力；6. 测土配方施肥：科学施肥。经过改良，土壤肥力明显提升。	soil-improvement.jpg	298	0	1	1	9	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
20	60	1	2	寻找粮食供应商	学校食堂需要长期采购粮食，包括大米、面粉等。要求：1. 品质好；2. 价格合理；3. 供货稳定；4. 能提供检测报告。有意向的请联系。	\N	289	0	2	0	5	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
21	51	1	1	有机肥料的制作与使用	有机肥料制作方法：1. 原料：秸秆、畜禽粪便、菌种；2. 堆肥：分层堆放，保持湿度；3. 发酵：15-20天翻堆一次，共3-4次；4. 腐熟：2-3个月完全腐熟。使用时作底肥，亩施2000-3000kg，效果很好。	organic-fertilizer.jpg	334	1	1	0	10	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
22	52	201	1	西红柿种植管理技术	西红柿种植要点：1. 育苗：温室育苗，苗龄60天；2. 定植：4月下旬，株距40cm；3. 整枝：单干整枝或双干整枝；4. 施肥：底肥+追肥，结果期增施钾肥；5. 浇水：见干见湿；6. 病虫害防治：预防为主。	tomato-greenhouse.jpg	312	0	1	0	11	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
23	53	1	1	智慧农业技术应用	智慧农业技术应用：1. 物联网监测：实时监测温湿度、土壤等；2. 智能灌溉：根据需求自动灌溉；3. 无人机植保：提高效率；4. 大数据分析：科学决策。虽然投入大，但长期看效益很好。	smart-agriculture.jpg	512	2	2	1	16	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
24	56	301	3	脐橙批发价格咨询	想大批量采购脐橙，请问现在的批发价格是多少？需要70-80mm规格的，品质要好。有货源的农友请报价，谢谢！	\N	267	0	2	0	4	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
25	54	201	1	黄瓜种植技术要点	黄瓜种植经验：1. 品种选择：根据季节选择品种；2. 育苗：温室育苗，苗龄25-30天；3. 定植：株距30cm，行距60cm；4. 搭架：及时搭架引蔓；5. 整枝：主蔓结瓜，侧蔓及时摘除；6. 水肥管理：结瓜期加强水肥。	cucumber-greenhouse.jpg	267	0	2	0	8	1	0	2025-11-28 04:07:57.079005	2025-11-28 04:09:07.897343
\.


--
-- Data for Name: community_content_tags; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.community_content_tags (id, content_id, tag_id, create_time) FROM stdin;
1	1	1	2025-11-17 12:54:44.068
2	1	5	2025-11-17 12:54:44.068
3	2	1	2025-11-17 12:54:44.068
4	2	2	2025-11-17 12:54:44.068
5	3	6	2025-11-17 12:54:44.069
6	4	7	2025-11-17 12:54:44.069
7	6	1	2025-11-28 04:09:07.897343
8	6	3	2025-11-28 04:09:07.897343
9	6	4	2025-11-28 04:09:07.897343
10	7	2	2025-11-28 04:09:07.897343
11	7	6	2025-11-28 04:09:07.897343
12	9	8	2025-11-28 04:09:07.897343
13	9	11	2025-11-28 04:09:07.897343
14	10	2	2025-11-28 04:09:07.897343
15	10	3	2025-11-28 04:09:07.897343
16	10	9	2025-11-28 04:09:07.897343
17	13	2	2025-11-28 04:09:07.897343
18	13	8	2025-11-28 04:09:07.897343
19	13	10	2025-11-28 04:09:07.897343
20	15	4	2025-11-28 04:09:07.897343
21	15	12	2025-11-28 04:09:07.897343
22	21	3	2025-11-28 04:09:07.897343
23	21	10	2025-11-28 04:09:07.897343
24	21	13	2025-11-28 04:09:07.897343
25	23	12	2025-11-28 04:09:07.897343
26	23	15	2025-11-28 04:09:07.897343
27	11	7	2025-11-28 04:09:07.897343
28	11	14	2025-11-28 04:09:07.897343
\.


--
-- Data for Name: community_follows; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.community_follows (follow_id, follower_id, followed_id, follow_source, create_time) FROM stdin;
1	1	2	1	2025-11-17 12:54:44.12
2	1	3	1	2025-11-17 12:54:44.12
3	2	1	1	2025-11-17 12:54:44.12
4	3	1	1	2025-11-17 12:54:44.12
5	56	51	1	2025-11-28 04:09:07.897343
6	56	54	1	2025-11-28 04:09:07.897343
7	57	51	1	2025-11-28 04:09:07.897343
8	57	52	1	2025-11-28 04:09:07.897343
9	51	52	1	2025-11-28 04:09:07.897343
10	52	53	1	2025-11-28 04:09:07.897343
11	53	55	1	2025-11-28 04:09:07.897343
\.


--
-- Data for Name: community_likes; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.community_likes (like_id, content_id, user_id, create_time) FROM stdin;
1	1	2	2025-11-17 12:54:44.134
2	1	3	2025-11-17 12:54:44.134
3	2	1	2025-11-17 12:54:44.134
4	3	1	2025-11-17 12:54:44.134
5	3	2	2025-11-17 12:54:44.134
6	6	56	2025-11-28 04:09:07.897343
7	10	56	2025-11-28 04:09:07.897343
8	13	56	2025-11-28 04:09:07.897343
9	23	56	2025-11-28 04:09:07.897343
10	7	57	2025-11-28 04:09:07.897343
11	15	57	2025-11-28 04:09:07.897343
12	9	51	2025-11-28 04:09:07.897343
13	21	51	2025-11-28 04:09:07.897343
14	16	52	2025-11-28 04:09:07.897343
15	23	52	2025-11-28 04:09:07.897343
16	6	53	2025-11-28 04:09:07.897343
17	7	53	2025-11-28 04:09:07.897343
18	13	53	2025-11-28 04:09:07.897343
\.


--
-- Data for Name: community_qa_relation; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.community_qa_relation (qa_id, content_id, best_comment_id, qa_status, resolve_time, reward_amount, reward_status, reward_time, create_time, update_time) FROM stdin;
1	3	\N	0	\N	10.00	0	\N	2025-11-17 12:54:44.193	2025-11-17 12:54:44.193
\.


--
-- Data for Name: community_reports; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.community_reports (report_id, report_no, reporter_id, report_type, report_obj_id, report_reason, report_detail, report_evidence, is_anonymous, audit_status, auditor_id, audit_time, audit_remark, create_time) FROM stdin;
\.


--
-- Data for Name: community_tags; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.community_tags (tag_id, tag_name, use_count, is_enabled, create_time) FROM stdin;
1	小麦种植	3	1	2025-11-07 15:54:26.171205
2	病虫害防治	4	1	2025-11-07 15:54:26.171205
3	施肥技术	3	1	2025-11-07 15:54:26.171205
4	灌溉管理	2	1	2025-11-07 15:54:26.171205
5	冬小麦	1	1	2025-11-07 15:54:26.171205
6	水稻种植	2	1	2025-11-28 04:07:57.079005
7	玉米种植	2	1	2025-11-28 04:07:57.079005
8	蔬菜种植	2	1	2025-11-28 04:07:57.079005
9	水果种植	1	1	2025-11-28 04:07:57.079005
10	有机农业	2	1	2025-11-28 04:07:57.079005
11	温室大棚	1	1	2025-11-28 04:07:57.079005
12	节水灌溉	2	1	2025-11-28 04:07:57.079005
13	土壤改良	1	1	2025-11-28 04:07:57.079005
14	市场行情	1	1	2025-11-28 04:07:57.079005
15	农机使用	1	1	2025-11-28 04:07:57.079005
\.


--
-- Data for Name: community_violations; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.community_violations (violation_id, report_id, violator_id, violation_type, violation_obj_id, handle_measure, handle_remark, handler_id, create_time) FROM stdin;
\.


--
-- Data for Name: financing_application; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.financing_application (application_id, application_no, application_status, apply_amount, apply_term, apply_term_type, bank_id, cancel_reason, cancel_time, contact_address, contact_phone, create_time, loan_purpose_detail, loan_type_id, material_urls, repayment_plan, source_id, update_time, user_id) FROM stdin;
81	FIN2024112000000001	5	100000.00	6	2	1	\N	\N	河南省周口市农业路1号	13900000001	2024-11-20 09:00:00	用于2025年春季小麦种植，采购化肥5吨、农药200kg、种子500kg	1	/materials/id_card.jpg,/materials/plant_cert.jpg,/materials/bank_flow.pdf	预计2025年6月小麦收获后，通过平台销售回款还款	91	2024-11-22 10:00:00	51
82	FIN2024112100000002	3	150000.00	24	2	2	\N	\N	河南省新乡市农业路2号	13900000002	2024-11-21 09:00:00	购买约翰迪尔拖拉机一台，用于农场耕作	2	/materials/id_card.jpg,/materials/purchase_contract.pdf	分24期还款，每月还款约7000元	\N	2024-11-22 14:00:00	52
83	FIN2024112200000003	2	80000.00	3	2	3	\N	\N	江西省赣州市农业路3号	13900000003	2024-11-22 09:00:00	基于已有脐橙预售订单，需要资金采购包装材料和物流费用	3	/materials/id_card.jpg,/materials/presale_order.pdf	预售款到账后立即还款	95	2024-11-22 10:00:00	53
84	FIN2024112300000004	1	120000.00	9	2	1	\N	\N	福建省漳州市农业路4号	13900000004	2024-11-23 09:00:00	用于柑橘种植，采购有机肥10吨、生物农药、灌溉设备	1	/materials/id_card.jpg,/materials/plant_cert.jpg	预计2025年11月柑橘收获后还款	97	2024-11-23 10:00:00	54
85	FIN2024112400000005	2	500000.00	36	2	4	\N	\N	江苏省南京市农业路5号	13900000005	2024-11-24 09:00:00	建设智能温室大棚2000平米，用于有机蔬菜种植	4	/materials/id_card.jpg,/materials/construction_plan.pdf,/materials/land_cert.pdf	分36期还款，预计每月还款约15000元	\N	2024-11-24 10:00:00	55
86	FIN2024111500000006	5	80000.00	6	2	2	\N	\N	河南省周口市农业路1号	13900000001	2024-11-15 09:00:00	用于大米种植周转资金	1	/materials/id_card.jpg,/materials/plant_cert.jpg	收获后通过平台销售还款	92	2024-11-17 10:00:00	51
87	FIN2024111600000007	4	50000.00	2	2	5	\N	\N	河南省新乡市农业路2号	13900000002	2024-11-16 09:00:00	基于蔬菜预售订单的短期周转	3	/materials/id_card.jpg,/materials/presale_order.pdf	预售款到账后还款	93	2024-11-16 14:00:00	52
88	FIN2024111700000008	6	90000.00	8	2	1	\N	\N	江西省赣州市农业路3号	13900000003	2024-11-17 09:00:00	用于水果种植生产资料采购	1	/materials/id_card.jpg	收获后销售还款	\N	2024-11-17 09:00:00	53
89	FIN2024111800000009	0	110000.00	10	2	2	\N	\N	四川省安岳市农业路4号	13900000004	2024-11-18 09:00:00	用于柠檬种植周转资金	1	/materials/id_card.jpg,/materials/plant_cert.jpg	收获后还款	98	2024-11-18 09:00:00	54
90	FIN2024111900000010	1	70000.00	6	2	1	\N	\N	湖南省益阳市农业路5号	13900000005	2024-11-19 09:00:00	用于糙米种植资金周转	1	/materials/id_card.jpg	收获后销售还款	99	2024-11-19 10:00:00	55
\.


--
-- Data for Name: financing_bank; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.financing_bank (bank_id, approval_cycle, bank_city, bank_logo, bank_name, bank_province, bank_short_name, bank_status, contact_department, contact_email, contact_person, contact_phone, create_time, supported_loan_types, update_time) FROM stdin;
41	3-5个工作日	\N	/logos/abc.png	中国农业银行股份有限公司河南省分行	河南省	农行河南分行	1	三农金融部	zhang@abc.com	张经理	0371-65000001	2024-11-01 10:00:00	1,2,4,5	2024-11-01 10:00:00
42	2-4个工作日	\N	/logos/psbc.png	中国邮政储蓄银行河南省分行	河南省	邮储银行河南分行	1	三农金融事业部	li@psbc.com	李经理	0371-65000002	2024-11-01 10:00:00	1,3,5	2024-11-01 10:00:00
43	1-3个工作日	\N	/logos/rccu.png	河南省农村信用社联合社	河南省	河南农信社	1	信贷部	wang@rccu.com	王主任	0371-65000003	2024-11-01 10:00:00	1,3	2024-11-01 10:00:00
44	5-7个工作日	郑州市	/logos/icbc.png	中国工商银行河南省分行	河南省	工行河南分行	1	普惠金融部	zhao@icbc.com	赵经理	0371-65000004	2024-11-01 10:00:00	2	2024-11-01 10:00:00
45	2-3个工作日	\N	/logos/rcb.png	河南农村商业银行	河南省	河南农商行	1	小微金融部	liu@rcb.com	刘经理	0371-65000005	2024-11-01 10:00:00	3	2024-11-01 10:00:00
\.


--
-- Data for Name: financing_bank_approval; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.financing_bank_approval (approval_id, application_id, approval_amount, approval_remark, approval_result, approval_term, approval_time, approver_id, approver_name, bank_id, interest_rate, loan_account, loan_contract_url, loan_time, repayment_method, sign_time) FROM stdin;
11	81	100000.00	申请材料齐全，信用良好，同意放款10万元	1	6	2024-11-21 14:00:00	11	张经理	1	0.0520	ENCRYPTED_BANK_ACCOUNT_001	/contracts/loan_001.pdf	2024-11-22 10:00:00	按月付息，到期还本	2024-11-21 14:00:00
12	82	150000.00	农机购置贷款，同意放款15万元	1	24	2024-11-22 14:00:00	11	李经理	2	0.0550	ENCRYPTED_BANK_ACCOUNT_002	/contracts/loan_002.pdf	\N	等额本息	2024-11-22 14:00:00
13	86	80000.00	有良好还款记录，同意放款8万元	1	6	2024-11-16 14:00:00	11	李经理	2	0.0480	ENCRYPTED_BANK_ACCOUNT_001	/contracts/loan_006.pdf	2024-11-17 10:00:00	按月付息，到期还本	2024-11-16 14:00:00
14	87	\N	信用评分不达标，建议提高信用等级后再申请	2	\N	2024-11-16 14:00:00	11	刘经理	5	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: financing_credit_evaluation; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.financing_credit_evaluation (evaluation_id, application_id, credit_level, credit_report_url, credit_score, data_sources, evaluation_remark, evaluation_result, evaluation_time, evaluation_type, evaluator_id, report_generate_time, score_detail, user_id) FROM stdin;
42	81	A级	/reports/credit_001.pdf	85	平台交易记录,农户经营信息,第三方征信数据	经营年限3年，平台年交易额50万，信用良好	1	2024-11-20 10:00:00	1	\N	2024-11-20 10:00:00	{"经营年限":20,"种植规模":18,"平台交易":30,"征信记录":17}	51
43	82	B级	/reports/credit_002.pdf	78	平台交易记录,农户经营信息	经营年限2年，平台交易额30万，信用良好	1	2024-11-21 10:00:00	1	\N	2024-11-21 10:00:00	{"经营年限":18,"种植规模":16,"平台交易":28,"征信记录":16}	52
44	83	A级	/reports/credit_003.pdf	82	平台交易记录,预售订单数据	有稳定预售订单，信用良好	1	2024-11-22 10:00:00	1	\N	2024-11-22 10:00:00	{"经营年限":19,"种植规模":17,"平台交易":29,"征信记录":17}	53
45	84	A级	/reports/credit_004.pdf	80	平台交易记录,农户经营信息	经营稳定，信用良好	1	2024-11-23 10:00:00	1	\N	2024-11-23 10:00:00	{"经营年限":19,"种植规模":16,"平台交易":28,"征信记录":17}	54
46	85	B级	/reports/credit_005.pdf	75	平台交易记录,农户经营信息	经营年限较短，但发展潜力大	1	2024-11-24 10:00:00	1	\N	2024-11-24 10:00:00	{"经营年限":17,"种植规模":15,"平台交易":27,"征信记录":16}	55
47	86	A级	/reports/credit_006.pdf	86	平台交易记录,历史还款记录	有良好还款记录，信用优秀	1	2024-11-15 10:00:00	1	\N	2024-11-15 10:00:00	{"经营年限":20,"种植规模":18,"平台交易":30,"征信记录":18}	51
48	87	C级	/reports/credit_007.pdf	55	平台交易记录	信用评分不达标，建议补充材料	2	2024-11-16 10:00:00	1	\N	2024-11-16 10:00:00	{"经营年限":12,"种植规模":11,"平台交易":18,"征信记录":14}	52
49	88	C级	/reports/credit_008.pdf	50	平台交易记录	经营时间短，信用记录不足	2	2024-11-17 10:00:00	1	\N	2024-11-17 10:00:00	{"经营年限":10,"种植规模":10,"平台交易":16,"征信记录":14}	53
50	89	A级	/reports/credit_009.pdf	81	平台交易记录,农户经营信息	信用良好，待提交申请	1	2024-11-18 10:00:00	1	\N	2024-11-18 10:00:00	{"经营年限":19,"种植规模":17,"平台交易":28,"征信记录":17}	54
51	90	B级	/reports/credit_010.pdf	79	平台交易记录	信用良好，待提交申请	1	2024-11-19 10:00:00	1	\N	2024-11-19 10:00:00	{"经营年限":18,"种植规模":16,"平台交易":28,"征信记录":17}	55
\.


--
-- Data for Name: financing_loan_type; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.financing_loan_type (loan_type_id, applicable_objects, create_time, interest_rate_type, loan_purpose, loan_term_type, loan_type_name, max_interest_rate, max_loan_amount, max_loan_term, min_interest_rate, min_loan_amount, min_loan_term, required_materials, sort, status, support_banks, update_time) FROM stdin;
43	种植规模≥50亩的农户	2024-11-01 10:00:00	1	用于农作物种植期间化肥、农药、种子等生产资料采购	2	种植周转贷	0.0650	500000.00	12	0.0435	10000.00	3	身份证,种植证明,银行流水,土地承包合同	1	1	中国农业银行,中国邮政储蓄银行,农村信用社	2024-11-01 10:00:00
44	经营满1年的农户或合作社	2024-11-01 10:00:00	1	用于购买拖拉机、收割机等农业机械设备	2	农机购置贷	0.0700	1000000.00	36	0.0450	50000.00	6	身份证,购机合同,银行流水,经营证明	2	1	中国农业银行,中国工商银行	2024-11-01 10:00:00
45	有预售订单的农户	2024-11-01 10:00:00	2	基于农产品预售订单的短期周转资金	2	农产品预售贷	0.0600	300000.00	6	0.0400	20000.00	1	身份证,预售订单,货源证明,银行流水	3	1	中国邮政储蓄银行,农村商业银行	2024-11-01 10:00:00
46	经营满2年的农户或合作社	2024-11-01 10:00:00	1	用于温室大棚、灌溉设施等农业基础设施建设	2	设施农业贷	0.0750	2000000.00	60	0.0500	100000.00	12	身份证,建设规划,土地证明,银行流水,经营证明	4	1	中国农业银行,农业发展银行	2024-11-01 10:00:00
47	养殖规模≥100头/500只的养殖户	2024-11-01 10:00:00	1	用于畜禽养殖期间饲料、兽药等生产资料采购	2	养殖周转贷	0.0680	600000.00	18	0.0450	15000.00	3	身份证,养殖证明,银行流水,防疫证明	5	1	中国农业银行,中国邮政储蓄银行	2024-11-01 10:00:00
\.


--
-- Data for Name: financing_presale_plan; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.financing_presale_plan (plan_id, plan_no, user_id, category_id, product_name, plant_date, expected_harvest_date, total_yield_quantity, presale_unit_price, deposit_ratio, subscribed_quantity, plan_status, audit_status, audit_remark, create_time) FROM stdin;
11	PRE2024112000000001	51	102	2025年春季有机大米	2024-12-01	2025-06-15	50000.00	5.80	0.30	15000.00	2	1	预售计划合理，审核通过	2025-11-28 04:37:00.022254+08
12	PRE2024112100000002	53	301	2025年冬季赣南脐橙	2024-11-01	2025-11-30	80000.00	5.20	0.25	20000.00	2	1	预售计划合理，审核通过	2025-11-28 04:37:00.022254+08
13	PRE2024112200000003	52	201	2025年春季有机蔬菜	2025-01-01	2025-04-30	30000.00	7.00	0.30	10000.00	2	1	预售计划合理，审核通过	2025-11-28 04:37:00.022254+08
14	PRE2024112300000004	54	301	2025年夏季樱桃	2024-12-01	2025-05-31	15000.00	40.00	0.40	5000.00	2	1	预售计划合理，审核通过	2025-11-28 04:37:00.022254+08
15	PRE2024112400000005	55	102	2025年秋季糙米	2025-03-01	2025-10-31	40000.00	6.80	0.30	0.00	1	1	预售计划合理，审核通过	2025-11-28 04:37:00.022254+08
\.


--
-- Data for Name: financing_presale_subscription; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.financing_presale_subscription (subscription_id, subscription_no, plan_id, user_id, subscribed_quantity, deposit_amount, payment_status, payment_no, subscription_status, create_time) FROM stdin;
17	SUB2024112000000001	11	56	5000.00	8700.00	1	PAY20241120SUB001	1	2025-11-28 04:37:00.022254+08
18	SUB2024112000000002	11	57	10000.00	17400.00	1	PAY20241120SUB002	1	2025-11-28 04:37:00.022254+08
19	SUB2024112100000003	12	58	10000.00	13000.00	1	PAY20241121SUB003	1	2025-11-28 04:37:00.022254+08
20	SUB2024112100000004	12	59	10000.00	13000.00	1	PAY20241121SUB004	1	2025-11-28 04:37:00.022254+08
21	SUB2024112200000005	13	60	5000.00	10500.00	1	PAY20241122SUB005	1	2025-11-28 04:37:00.022254+08
22	SUB2024112200000006	13	56	5000.00	10500.00	1	PAY20241122SUB006	1	2025-11-28 04:37:00.022254+08
23	SUB2024112300000007	14	57	3000.00	48000.00	1	PAY20241123SUB007	1	2025-11-28 04:37:00.022254+08
24	SUB2024112300000008	14	58	2000.00	32000.00	1	PAY20241123SUB008	1	2025-11-28 04:37:00.022254+08
\.


--
-- Data for Name: financing_repayment_adjustment_request; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.financing_repayment_adjustment_request (request_id, application_id, approval_remark, approval_time, approver_id, create_time, proposed_plan_details, request_reason, request_status, user_id) FROM stdin;
3	81	考虑到天气因素，同意调整还款计划	2024-11-25 14:00:00	11	2024-11-25 09:00:00	申请将第5、6期还款顺延至6月和7月	因天气影响，小麦收获期延后一个月	1	51
4	86	\N	\N	\N	2024-11-26 09:00:00	申请将最后一期还款延后15天	市场价格波动，需要延长销售周期	0	51
\.


--
-- Data for Name: financing_repayment_schedule; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.financing_repayment_schedule (schedule_id, adjustment_request_id, application_id, due_date, interest_due, interest_paid, payment_status, principal_due, principal_paid, term_number) FROM stdin;
19	\N	81	2024-12-22	433.33	433.33	1	0.00	0.00	1
20	\N	81	2025-01-22	433.33	433.33	1	0.00	0.00	2
21	\N	81	2025-02-22	433.33	0.00	0	0.00	0.00	3
22	\N	81	2025-03-22	433.33	0.00	0	0.00	0.00	4
23	\N	81	2025-04-22	433.33	0.00	0	0.00	0.00	5
24	\N	81	2025-05-22	433.33	0.00	0	100000.00	0.00	6
25	\N	86	2024-12-17	320.00	320.00	1	0.00	0.00	1
26	\N	86	2025-01-17	320.00	0.00	0	0.00	0.00	2
27	\N	86	2025-02-17	320.00	0.00	0	0.00	0.00	3
\.


--
-- Data for Name: forecast_job_logs; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.forecast_job_logs (id, job_start_time, job_end_time, status, products_processed, forecasts_generated, error_message, created_at) FROM stdin;
1	2025-11-27 21:50:33.345818	2025-11-27 21:50:33.927454	completed	15	45	\N	2025-11-27 21:50:33.345818
\.


--
-- Data for Name: historical_prices; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.historical_prices (id, product_name, product_category, region, price_date, price, unit, source, created_at) FROM stdin;
1	大米	粮食	全国	2024-11-15	6.17	元/kg	系统生成	2025-11-27 21:50:30.393586
2	大米	粮食	全国	2024-12-15	4.99	元/kg	系统生成	2025-11-27 21:50:30.404409
3	大米	粮食	全国	2025-01-15	3.85	元/kg	系统生成	2025-11-27 21:50:30.413898
4	大米	粮食	全国	2025-02-15	3.85	元/kg	系统生成	2025-11-27 21:50:30.424294
5	大米	粮食	全国	2025-03-15	4.20	元/kg	系统生成	2025-11-27 21:50:30.437154
6	大米	粮食	全国	2025-04-15	5.02	元/kg	系统生成	2025-11-27 21:50:30.448155
7	大米	粮食	全国	2025-05-15	6.54	元/kg	系统生成	2025-11-27 21:50:30.45944
8	大米	粮食	全国	2025-06-15	6.85	元/kg	系统生成	2025-11-27 21:50:30.473595
9	大米	粮食	全国	2025-07-15	9.59	元/kg	系统生成	2025-11-27 21:50:30.483534
10	大米	粮食	全国	2025-08-15	9.36	元/kg	系统生成	2025-11-27 21:50:30.494005
11	大米	粮食	全国	2025-09-15	8.56	元/kg	系统生成	2025-11-27 21:50:30.502332
12	大米	粮食	全国	2025-10-15	7.48	元/kg	系统生成	2025-11-27 21:50:30.510521
13	大米	粮食	全国	2025-11-15	7.59	元/kg	系统生成	2025-11-27 21:50:30.519087
14	小麦	粮食	全国	2024-11-15	5.04	元/kg	系统生成	2025-11-27 21:50:30.52878
15	小麦	粮食	全国	2024-12-15	3.45	元/kg	系统生成	2025-11-27 21:50:30.56475
16	小麦	粮食	全国	2025-01-15	3.36	元/kg	系统生成	2025-11-27 21:50:30.575038
17	小麦	粮食	全国	2025-02-15	3.36	元/kg	系统生成	2025-11-27 21:50:30.584982
18	小麦	粮食	全国	2025-03-15	3.82	元/kg	系统生成	2025-11-27 21:50:30.594192
19	小麦	粮食	全国	2025-04-15	4.50	元/kg	系统生成	2025-11-27 21:50:30.601361
20	小麦	粮食	全国	2025-05-15	6.01	元/kg	系统生成	2025-11-27 21:50:30.607772
21	小麦	粮食	全国	2025-06-15	6.14	元/kg	系统生成	2025-11-27 21:50:30.613793
22	小麦	粮食	全国	2025-07-15	7.20	元/kg	系统生成	2025-11-27 21:50:30.619487
23	小麦	粮食	全国	2025-08-15	8.07	元/kg	系统生成	2025-11-27 21:50:30.625471
24	小麦	粮食	全国	2025-09-15	8.40	元/kg	系统生成	2025-11-27 21:50:30.631311
25	小麦	粮食	全国	2025-10-15	7.21	元/kg	系统生成	2025-11-27 21:50:30.6374
26	小麦	粮食	全国	2025-11-15	6.09	元/kg	系统生成	2025-11-27 21:50:30.644327
27	玉米	粮食	全国	2024-11-15	2.80	元/kg	系统生成	2025-11-27 21:50:30.65156
28	玉米	粮食	全国	2024-12-15	2.36	元/kg	系统生成	2025-11-27 21:50:30.661755
29	玉米	粮食	全国	2025-01-15	2.24	元/kg	系统生成	2025-11-27 21:50:30.670091
30	玉米	粮食	全国	2025-02-15	2.24	元/kg	系统生成	2025-11-27 21:50:30.678301
31	玉米	粮食	全国	2025-03-15	2.24	元/kg	系统生成	2025-11-27 21:50:30.686968
32	玉米	粮食	全国	2025-04-15	2.37	元/kg	系统生成	2025-11-27 21:50:30.698238
33	玉米	粮食	全国	2025-05-15	4.00	元/kg	系统生成	2025-11-27 21:50:30.709562
34	玉米	粮食	全国	2025-06-15	4.39	元/kg	系统生成	2025-11-27 21:50:30.720544
35	玉米	粮食	全国	2025-07-15	4.93	元/kg	系统生成	2025-11-27 21:50:30.731777
36	玉米	粮食	全国	2025-08-15	4.91	元/kg	系统生成	2025-11-27 21:50:30.742839
37	玉米	粮食	全国	2025-09-15	5.10	元/kg	系统生成	2025-11-27 21:50:30.982245
38	玉米	粮食	全国	2025-10-15	4.80	元/kg	系统生成	2025-11-27 21:50:30.993791
39	玉米	粮食	全国	2025-11-15	3.80	元/kg	系统生成	2025-11-27 21:50:31.004757
40	大豆	粮食	全国	2024-11-15	6.37	元/kg	系统生成	2025-11-27 21:50:31.016819
41	大豆	粮食	全国	2024-12-15	5.80	元/kg	系统生成	2025-11-27 21:50:31.028111
42	大豆	粮食	全国	2025-01-15	4.91	元/kg	系统生成	2025-11-27 21:50:31.039348
43	大豆	粮食	全国	2025-02-15	4.55	元/kg	系统生成	2025-11-27 21:50:31.050372
44	大豆	粮食	全国	2025-03-15	4.92	元/kg	系统生成	2025-11-27 21:50:31.059561
45	大豆	粮食	全国	2025-04-15	5.51	元/kg	系统生成	2025-11-27 21:50:31.068479
46	大豆	粮食	全国	2025-05-15	7.11	元/kg	系统生成	2025-11-27 21:50:31.077276
47	大豆	粮食	全国	2025-06-15	9.52	元/kg	系统生成	2025-11-27 21:50:31.085417
48	大豆	粮食	全国	2025-07-15	10.34	元/kg	系统生成	2025-11-27 21:50:31.09343
49	大豆	粮食	全国	2025-08-15	10.43	元/kg	系统生成	2025-11-27 21:50:31.102839
50	大豆	粮食	全国	2025-09-15	10.39	元/kg	系统生成	2025-11-27 21:50:31.110533
51	大豆	粮食	全国	2025-10-15	8.87	元/kg	系统生成	2025-11-27 21:50:31.119354
52	大豆	粮食	全国	2025-11-15	7.81	元/kg	系统生成	2025-11-27 21:50:31.128346
53	猪肉	肉类	全国	2024-11-15	29.97	元/kg	系统生成	2025-11-27 21:50:31.13721
54	猪肉	肉类	全国	2024-12-15	20.73	元/kg	系统生成	2025-11-27 21:50:31.144704
55	猪肉	肉类	全国	2025-01-15	19.60	元/kg	系统生成	2025-11-27 21:50:31.152377
56	猪肉	肉类	全国	2025-02-15	19.60	元/kg	系统生成	2025-11-27 21:50:31.15905
57	猪肉	肉类	全国	2025-03-15	19.67	元/kg	系统生成	2025-11-27 21:50:31.165638
58	猪肉	肉类	全国	2025-04-15	26.13	元/kg	系统生成	2025-11-27 21:50:31.173859
59	猪肉	肉类	全国	2025-05-15	32.55	元/kg	系统生成	2025-11-27 21:50:31.179906
60	猪肉	肉类	全国	2025-06-15	37.38	元/kg	系统生成	2025-11-27 21:50:31.185492
61	猪肉	肉类	全国	2025-07-15	44.03	元/kg	系统生成	2025-11-27 21:50:31.192589
62	猪肉	肉类	全国	2025-08-15	43.49	元/kg	系统生成	2025-11-27 21:50:31.199459
63	猪肉	肉类	全国	2025-09-15	42.08	元/kg	系统生成	2025-11-27 21:50:31.206636
64	猪肉	肉类	全国	2025-10-15	37.97	元/kg	系统生成	2025-11-27 21:50:31.214957
65	猪肉	肉类	全国	2025-11-15	34.35	元/kg	系统生成	2025-11-27 21:50:31.224885
66	牛肉	肉类	全国	2024-11-15	55.45	元/kg	系统生成	2025-11-27 21:50:31.236007
67	牛肉	肉类	全国	2024-12-15	55.64	元/kg	系统生成	2025-11-27 21:50:31.247102
68	牛肉	肉类	全国	2025-01-15	45.50	元/kg	系统生成	2025-11-27 21:50:31.260376
69	牛肉	肉类	全国	2025-02-15	45.50	元/kg	系统生成	2025-11-27 21:50:31.273262
70	牛肉	肉类	全国	2025-03-15	45.50	元/kg	系统生成	2025-11-27 21:50:31.284717
71	牛肉	肉类	全国	2025-04-15	55.92	元/kg	系统生成	2025-11-27 21:50:31.295127
72	牛肉	肉类	全国	2025-05-15	81.13	元/kg	系统生成	2025-11-27 21:50:31.305868
73	牛肉	肉类	全国	2025-06-15	89.97	元/kg	系统生成	2025-11-27 21:50:31.317905
74	牛肉	肉类	全国	2025-07-15	112.83	元/kg	系统生成	2025-11-27 21:50:31.328051
75	牛肉	肉类	全国	2025-08-15	109.71	元/kg	系统生成	2025-11-27 21:50:31.337348
76	牛肉	肉类	全国	2025-09-15	105.13	元/kg	系统生成	2025-11-27 21:50:31.346309
77	牛肉	肉类	全国	2025-10-15	92.12	元/kg	系统生成	2025-11-27 21:50:31.353411
78	牛肉	肉类	全国	2025-11-15	74.59	元/kg	系统生成	2025-11-27 21:50:31.361122
79	鸡肉	肉类	全国	2024-11-15	18.87	元/kg	系统生成	2025-11-27 21:50:31.366987
80	鸡肉	肉类	全国	2024-12-15	16.28	元/kg	系统生成	2025-11-27 21:50:31.373387
81	鸡肉	肉类	全国	2025-01-15	12.60	元/kg	系统生成	2025-11-27 21:50:31.380819
82	鸡肉	肉类	全国	2025-02-15	12.60	元/kg	系统生成	2025-11-27 21:50:31.389605
83	鸡肉	肉类	全国	2025-03-15	13.35	元/kg	系统生成	2025-11-27 21:50:31.398659
84	鸡肉	肉类	全国	2025-04-15	16.96	元/kg	系统生成	2025-11-27 21:50:31.406351
85	鸡肉	肉类	全国	2025-05-15	17.80	元/kg	系统生成	2025-11-27 21:50:31.41502
86	鸡肉	肉类	全国	2025-06-15	26.97	元/kg	系统生成	2025-11-27 21:50:31.424499
87	鸡肉	肉类	全国	2025-07-15	26.79	元/kg	系统生成	2025-11-27 21:50:31.435417
88	鸡肉	肉类	全国	2025-08-15	29.91	元/kg	系统生成	2025-11-27 21:50:31.446131
89	鸡肉	肉类	全国	2025-09-15	28.22	元/kg	系统生成	2025-11-27 21:50:31.458135
90	鸡肉	肉类	全国	2025-10-15	28.69	元/kg	系统生成	2025-11-27 21:50:31.46858
91	鸡肉	肉类	全国	2025-11-15	21.43	元/kg	系统生成	2025-11-27 21:50:31.479444
92	鸡蛋	禽蛋	全国	2024-11-15	12.04	元/kg	系统生成	2025-11-27 21:50:31.48962
93	鸡蛋	禽蛋	全国	2024-12-15	7.51	元/kg	系统生成	2025-11-27 21:50:31.498304
94	鸡蛋	禽蛋	全国	2025-01-15	7.35	元/kg	系统生成	2025-11-27 21:50:31.506803
95	鸡蛋	禽蛋	全国	2025-02-15	7.35	元/kg	系统生成	2025-11-27 21:50:31.514627
96	鸡蛋	禽蛋	全国	2025-03-15	7.35	元/kg	系统生成	2025-11-27 21:50:31.522343
97	鸡蛋	禽蛋	全国	2025-04-15	10.49	元/kg	系统生成	2025-11-27 21:50:31.528857
98	鸡蛋	禽蛋	全国	2025-05-15	11.55	元/kg	系统生成	2025-11-27 21:50:31.534907
99	鸡蛋	禽蛋	全国	2025-06-15	13.77	元/kg	系统生成	2025-11-27 21:50:31.541254
100	鸡蛋	禽蛋	全国	2025-07-15	17.89	元/kg	系统生成	2025-11-27 21:50:31.547218
101	鸡蛋	禽蛋	全国	2025-08-15	18.92	元/kg	系统生成	2025-11-27 21:50:31.553446
102	鸡蛋	禽蛋	全国	2025-09-15	16.01	元/kg	系统生成	2025-11-27 21:50:31.561197
103	鸡蛋	禽蛋	全国	2025-10-15	14.67	元/kg	系统生成	2025-11-27 21:50:31.569333
104	鸡蛋	禽蛋	全国	2025-11-15	14.04	元/kg	系统生成	2025-11-27 21:50:31.57789
105	白菜	蔬菜	全国	2024-11-15	2.19	元/kg	系统生成	2025-11-27 21:50:31.587557
106	白菜	蔬菜	全国	2024-12-15	2.16	元/kg	系统生成	2025-11-27 21:50:31.597463
107	白菜	蔬菜	全国	2025-01-15	1.75	元/kg	系统生成	2025-11-27 21:50:31.611993
108	白菜	蔬菜	全国	2025-02-15	1.75	元/kg	系统生成	2025-11-27 21:50:31.623038
109	白菜	蔬菜	全国	2025-03-15	1.75	元/kg	系统生成	2025-11-27 21:50:31.635377
110	白菜	蔬菜	全国	2025-04-15	1.90	元/kg	系统生成	2025-11-27 21:50:31.646375
111	白菜	蔬菜	全国	2025-05-15	2.86	元/kg	系统生成	2025-11-27 21:50:31.656157
112	白菜	蔬菜	全国	2025-06-15	3.26	元/kg	系统生成	2025-11-27 21:50:31.666705
113	白菜	蔬菜	全国	2025-07-15	4.16	元/kg	系统生成	2025-11-27 21:50:31.674568
114	白菜	蔬菜	全国	2025-08-15	4.54	元/kg	系统生成	2025-11-27 21:50:31.682243
115	白菜	蔬菜	全国	2025-09-15	4.24	元/kg	系统生成	2025-11-27 21:50:31.690516
116	白菜	蔬菜	全国	2025-10-15	3.93	元/kg	系统生成	2025-11-27 21:50:31.698957
117	白菜	蔬菜	全国	2025-11-15	3.15	元/kg	系统生成	2025-11-27 21:50:31.707551
118	土豆	蔬菜	全国	2024-11-15	3.33	元/kg	系统生成	2025-11-27 21:50:31.715525
119	土豆	蔬菜	全国	2024-12-15	2.48	元/kg	系统生成	2025-11-27 21:50:31.723137
120	土豆	蔬菜	全国	2025-01-15	2.10	元/kg	系统生成	2025-11-27 21:50:31.731147
121	土豆	蔬菜	全国	2025-02-15	2.10	元/kg	系统生成	2025-11-27 21:50:31.739527
122	土豆	蔬菜	全国	2025-03-15	2.10	元/kg	系统生成	2025-11-27 21:50:31.748573
123	土豆	蔬菜	全国	2025-04-15	2.13	元/kg	系统生成	2025-11-27 21:50:31.756501
124	土豆	蔬菜	全国	2025-05-15	3.77	元/kg	系统生成	2025-11-27 21:50:31.764574
125	土豆	蔬菜	全国	2025-06-15	4.53	元/kg	系统生成	2025-11-27 21:50:31.773831
126	土豆	蔬菜	全国	2025-07-15	5.08	元/kg	系统生成	2025-11-27 21:50:31.782952
127	土豆	蔬菜	全国	2025-08-15	5.18	元/kg	系统生成	2025-11-27 21:50:31.791479
128	土豆	蔬菜	全国	2025-09-15	4.99	元/kg	系统生成	2025-11-27 21:50:31.800573
129	土豆	蔬菜	全国	2025-10-15	4.33	元/kg	系统生成	2025-11-27 21:50:31.810483
130	土豆	蔬菜	全国	2025-11-15	3.30	元/kg	系统生成	2025-11-27 21:50:32.037041
131	番茄	蔬菜	全国	2024-11-15	5.88	元/kg	系统生成	2025-11-27 21:50:32.045989
132	番茄	蔬菜	全国	2024-12-15	3.85	元/kg	系统生成	2025-11-27 21:50:32.055954
133	番茄	蔬菜	全国	2025-01-15	3.85	元/kg	系统生成	2025-11-27 21:50:32.065973
134	番茄	蔬菜	全国	2025-02-15	3.85	元/kg	系统生成	2025-11-27 21:50:32.07649
135	番茄	蔬菜	全国	2025-03-15	3.85	元/kg	系统生成	2025-11-27 21:50:32.087047
136	番茄	蔬菜	全国	2025-04-15	3.85	元/kg	系统生成	2025-11-27 21:50:32.098145
137	番茄	蔬菜	全国	2025-05-15	6.94	元/kg	系统生成	2025-11-27 21:50:32.10938
138	番茄	蔬菜	全国	2025-06-15	8.42	元/kg	系统生成	2025-11-27 21:50:32.126289
139	番茄	蔬菜	全国	2025-07-15	9.13	元/kg	系统生成	2025-11-27 21:50:32.137325
140	番茄	蔬菜	全国	2025-08-15	8.81	元/kg	系统生成	2025-11-27 21:50:32.147629
141	番茄	蔬菜	全国	2025-09-15	8.75	元/kg	系统生成	2025-11-27 21:50:32.158627
142	番茄	蔬菜	全国	2025-10-15	7.72	元/kg	系统生成	2025-11-27 21:50:32.169208
143	番茄	蔬菜	全国	2025-11-15	6.00	元/kg	系统生成	2025-11-27 21:50:32.181137
144	黄瓜	蔬菜	全国	2024-11-15	4.03	元/kg	系统生成	2025-11-27 21:50:32.191671
145	黄瓜	蔬菜	全国	2024-12-15	3.24	元/kg	系统生成	2025-11-27 21:50:32.201541
146	黄瓜	蔬菜	全国	2025-01-15	2.80	元/kg	系统生成	2025-11-27 21:50:32.210845
147	黄瓜	蔬菜	全国	2025-02-15	2.80	元/kg	系统生成	2025-11-27 21:50:32.219397
148	黄瓜	蔬菜	全国	2025-03-15	2.80	元/kg	系统生成	2025-11-27 21:50:32.228084
149	黄瓜	蔬菜	全国	2025-04-15	3.36	元/kg	系统生成	2025-11-27 21:50:32.236581
150	黄瓜	蔬菜	全国	2025-05-15	4.62	元/kg	系统生成	2025-11-27 21:50:32.246322
151	黄瓜	蔬菜	全国	2025-06-15	5.41	元/kg	系统生成	2025-11-27 21:50:32.254516
152	黄瓜	蔬菜	全国	2025-07-15	6.41	元/kg	系统生成	2025-11-27 21:50:32.263221
153	黄瓜	蔬菜	全国	2025-08-15	6.75	元/kg	系统生成	2025-11-27 21:50:32.272418
154	黄瓜	蔬菜	全国	2025-09-15	6.63	元/kg	系统生成	2025-11-27 21:50:32.283343
155	黄瓜	蔬菜	全国	2025-10-15	5.86	元/kg	系统生成	2025-11-27 21:50:32.296653
156	黄瓜	蔬菜	全国	2025-11-15	4.80	元/kg	系统生成	2025-11-27 21:50:32.307045
157	苹果	水果	全国	2024-11-15	8.65	元/kg	系统生成	2025-11-27 21:50:32.318147
158	苹果	水果	全国	2024-12-15	5.60	元/kg	系统生成	2025-11-27 21:50:32.330408
159	苹果	水果	全国	2025-01-15	5.60	元/kg	系统生成	2025-11-27 21:50:32.342932
160	苹果	水果	全国	2025-02-15	5.60	元/kg	系统生成	2025-11-27 21:50:32.352958
161	苹果	水果	全国	2025-03-15	5.99	元/kg	系统生成	2025-11-27 21:50:32.362572
162	苹果	水果	全国	2025-04-15	6.47	元/kg	系统生成	2025-11-27 21:50:32.370845
163	苹果	水果	全国	2025-05-15	8.88	元/kg	系统生成	2025-11-27 21:50:32.38006
164	苹果	水果	全国	2025-06-15	12.22	元/kg	系统生成	2025-11-27 21:50:32.388004
165	苹果	水果	全国	2025-07-15	11.69	元/kg	系统生成	2025-11-27 21:50:32.395664
166	苹果	水果	全国	2025-08-15	12.84	元/kg	系统生成	2025-11-27 21:50:32.404969
167	苹果	水果	全国	2025-09-15	12.75	元/kg	系统生成	2025-11-27 21:50:32.416003
168	苹果	水果	全国	2025-10-15	10.83	元/kg	系统生成	2025-11-27 21:50:32.426417
169	苹果	水果	全国	2025-11-15	9.51	元/kg	系统生成	2025-11-27 21:50:32.436363
170	香蕉	水果	全国	2024-11-15	5.46	元/kg	系统生成	2025-11-27 21:50:32.445881
171	香蕉	水果	全国	2024-12-15	4.79	元/kg	系统生成	2025-11-27 21:50:32.454363
172	香蕉	水果	全国	2025-01-15	4.20	元/kg	系统生成	2025-11-27 21:50:32.463068
173	香蕉	水果	全国	2025-02-15	4.20	元/kg	系统生成	2025-11-27 21:50:32.471523
174	香蕉	水果	全国	2025-03-15	4.20	元/kg	系统生成	2025-11-27 21:50:32.47897
175	香蕉	水果	全国	2025-04-15	5.44	元/kg	系统生成	2025-11-27 21:50:32.487065
176	香蕉	水果	全国	2025-05-15	7.57	元/kg	系统生成	2025-11-27 21:50:32.494701
177	香蕉	水果	全国	2025-06-15	8.64	元/kg	系统生成	2025-11-27 21:50:32.50325
178	香蕉	水果	全国	2025-07-15	9.24	元/kg	系统生成	2025-11-27 21:50:32.511259
179	香蕉	水果	全国	2025-08-15	9.46	元/kg	系统生成	2025-11-27 21:50:32.519911
180	香蕉	水果	全国	2025-09-15	10.27	元/kg	系统生成	2025-11-27 21:50:32.530341
181	香蕉	水果	全国	2025-10-15	8.06	元/kg	系统生成	2025-11-27 21:50:32.762424
182	香蕉	水果	全国	2025-11-15	8.25	元/kg	系统生成	2025-11-27 21:50:32.772631
183	橙子	水果	全国	2024-11-15	6.35	元/kg	系统生成	2025-11-27 21:50:32.783034
184	橙子	水果	全国	2024-12-15	4.90	元/kg	系统生成	2025-11-27 21:50:32.794757
185	橙子	水果	全国	2025-01-15	4.90	元/kg	系统生成	2025-11-27 21:50:32.806238
186	橙子	水果	全国	2025-02-15	4.90	元/kg	系统生成	2025-11-27 21:50:32.817771
187	橙子	水果	全国	2025-03-15	5.40	元/kg	系统生成	2025-11-27 21:50:32.82959
188	橙子	水果	全国	2025-04-15	6.39	元/kg	系统生成	2025-11-27 21:50:32.841134
189	橙子	水果	全国	2025-05-15	8.20	元/kg	系统生成	2025-11-27 21:50:32.852243
190	橙子	水果	全国	2025-06-15	9.83	元/kg	系统生成	2025-11-27 21:50:32.862295
191	橙子	水果	全国	2025-07-15	10.71	元/kg	系统生成	2025-11-27 21:50:32.872174
192	橙子	水果	全国	2025-08-15	11.65	元/kg	系统生成	2025-11-27 21:50:32.88175
193	橙子	水果	全国	2025-09-15	10.91	元/kg	系统生成	2025-11-27 21:50:32.891479
194	橙子	水果	全国	2025-10-15	11.03	元/kg	系统生成	2025-11-27 21:50:32.900523
195	橙子	水果	全国	2025-11-15	9.24	元/kg	系统生成	2025-11-27 21:50:32.909472
\.


--
-- Data for Name: mall_buyer_demand; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_buyer_demand (demand_id, user_id, category_id, demand_no, product_name, product_spec, origin_require, required_quantity, purchased_quantity, max_unit_price, delivery_address_id, latest_delivery_date, payment_type, demand_desc, match_source_ids, demand_status, cancel_time, cancel_reason, create_time, update_time) FROM stdin;
21	56	101	DEM000000000000001	优质小麦	一级以上	河南、河北	10000.00	0.00	3.00	63	2024-12-31	1	需要优质小麦用于面粉加工	\N	1	\N	\N	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
22	57	102	DEM000000000000002	有机大米	特级	东北地区	5000.00	0.00	7.00	64	2024-12-25	2	餐饮连锁采购	\N	1	\N	\N	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
23	58	201	DEM000000000000003	新鲜蔬菜	各类叶菜	本地	2000.00	0.00	10.00	65	2024-12-05	1	批发市场日常采购	\N	1	\N	\N	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
24	59	301	DEM000000000000004	脐橙	大果	江西赣州	8000.00	0.00	6.50	66	2024-12-20	1	超市采购	\N	1	\N	\N	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
25	60	201	DEM000000000000005	菠菜	有机	本地	1000.00	0.00	9.00	67	2024-12-06	1	需要有机认证	\N	1	\N	\N	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
26	56	301	DEM000000000000006	柚子	红心柚	福建	6000.00	0.00	5.20	63	2024-12-22	2	电商平台采购	\N	1	\N	\N	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
27	57	201	DEM000000000000007	胡萝卜	中等	山东	10000.00	0.00	3.20	64	2024-12-28	1	酒店集团采购	\N	1	\N	\N	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
28	58	301	DEM000000000000008	樱桃	大果	山东	2000.00	0.00	50.00	65	2025-05-20	1	预订明年樱桃	\N	1	\N	\N	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
29	59	102	DEM000000000000009	糙米	有机	湖南	3000.00	0.00	8.00	66	2024-12-18	1	健康食品店采购	\N	1	\N	\N	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
30	60	201	DEM000000000000010	黄瓜	水果黄瓜	不限	5000.00	0.00	6.00	67	2024-12-15	1	生鲜超市采购	\N	1	\N	\N	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
\.


--
-- Data for Name: mall_coupon_rule; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_coupon_rule (rule_id, coupon_type, coupon_name, face_value, discount_rate, min_use_amount, max_discount_amount, valid_start_time, valid_end_time, total_quantity, used_quantity, obtain_limit, apply_category_ids, apply_source_ids, obtain_type, status, create_user, create_time, update_time) FROM stdin;
\.


--
-- Data for Name: mall_discount_activity; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_discount_activity (activity_id, activity_no, activity_name, activity_type, start_time, end_time, discount_rule, apply_category_ids, apply_source_ids, activity_status, total_source_count, total_order_count, total_sales_amount, create_user, create_time, update_time) FROM stdin;
2	ACT001	冬季清仓大促	2	2025-11-22 19:48:16.915305	2025-12-22 19:48:16.915305	全场指定商品 8 折	\N	\N	1	0	0	0.00	1	2025-11-27 19:48:16.915305	2025-11-27 19:48:16.915305
\.


--
-- Data for Name: mall_farmer_source; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_farmer_source (source_id, user_id, category_id, source_no, product_name, product_spec, origin, plant_date, harvest_date, expire_date, total_quantity, surplus_quantity, unit_price, batch_price, batch_quantity, is_discount, product_images, product_video, product_desc, logistics_type, freight_rule, min_order_quantity, audit_status, audit_user, audit_time, audit_remark, source_status, view_count, collect_count, create_time, update_time) FROM stdin;
55	1	101	SRC001	有机小麦	50kg/袋	河南省郑州市中牟县	\N	2025-06-15	2026-06-14	10000.00	10000.00	2.85	2.60	5000.00	0	["https://via.placeholder.com/400x300/6B8E7F/FFFFFF?text=%E6%9C%89%E6%9C%BA%E5%B0%8F%E9%BA%A6"]	\N	采用有机肥种植，全程无农药残留	2	整车运输，运费买家承担	1000.00	1	\N	\N	\N	1	0	0	2025-11-27 19:48:16.915305	2025-11-27 20:55:48.941635
56	1	201	SRC002	新鲜番茄	10kg/箱	河南省郑州市中牟县	\N	2025-11-20	2025-12-20	5000.00	5000.00	3.50	3.20	2000.00	0	["https://via.placeholder.com/400x300/C9897C/FFFFFF?text=%E6%96%B0%E9%B2%9C%E7%95%AA%E8%8C%84"]	\N	大棚种植，新鲜采摘	2	顺丰冷链	500.00	1	\N	\N	\N	1	0	0	2025-11-27 19:48:16.915305	2025-11-27 20:55:48.950893
57	1	202	SRC003	有机黄瓜	5kg/箱	河南省郑州市中牟县	\N	2025-11-25	2025-12-10	3000.00	3000.00	4.20	3.80	1000.00	0	["https://via.placeholder.com/400x300/8FAA9B/FFFFFF?text=%E6%9C%89%E6%9C%BA%E9%BB%84%E7%93%9C"]	\N	无公害种植	2	德邦物流	200.00	1	\N	\N	\N	1	0	0	2025-11-27 19:48:16.915305	2025-11-27 20:55:48.978519
58	2	101	SRC004	优质玉米	50kg/袋	河南省开封市	\N	2025-09-10	2026-09-09	8000.00	8000.00	2.50	2.30	4000.00	0	["https://via.placeholder.com/400x300/6B8E7F/FFFFFF?text=%E4%BC%98%E8%B4%A8%E7%8E%89%E7%B1%B3"]	\N	非转基因玉米	2	整车运输	1000.00	1	\N	\N	\N	1	0	0	2025-11-27 19:48:16.915305	2025-11-27 20:55:49.008258
59	2	203	SRC005	新鲜生菜	3kg/箱	河南省开封市	\N	2025-11-26	2025-12-05	2000.00	2000.00	5.00	4.50	500.00	0	["https://via.placeholder.com/400x300/D4C5A0/FFFFFF?text=%E6%96%B0%E9%B2%9C%E7%94%9F%E8%8F%9C"]	\N	水培生菜	2	顺丰冷链	100.00	1	\N	\N	\N	1	0	0	2025-11-27 19:48:16.915305	2025-11-27 20:55:49.016773
91	51	101	SRC000000000000001	优质小麦	一级	河南周口	\N	2024-06-15	2025-06-15	50000.00	45000.00	2.80	2.60	1000.00	1	["wheat1.jpg"]	\N	优质小麦，颗粒饱满	1	10公里内免运费	100.00	1	\N	\N	\N	1	156	23	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
92	51	102	SRC000000000000002	有机大米	特级	黑龙江五常	\N	2024-10-01	2025-10-01	30000.00	28000.00	6.50	6.20	500.00	0	["rice1.jpg"]	\N	五常有机大米	2	全国包邮	50.00	1	\N	\N	\N	1	289	45	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
93	52	201	SRC000000000000003	有机菠菜	500g/把	江苏南京	\N	2024-11-15	2024-11-25	5000.00	4500.00	8.00	7.50	100.00	0	["spinach1.jpg"]	\N	有机菠菜，无农药	1	市内免运费	20.00	1	\N	\N	\N	1	234	56	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
94	52	201	SRC000000000000004	新鲜生菜	球生菜	河北廊坊	\N	2024-11-20	2024-12-05	6000.00	5500.00	6.00	5.50	100.00	0	["lettuce1.jpg"]	\N	新鲜球生菜	1	京津冀包邮	50.00	1	\N	\N	\N	1	156	31	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
95	53	301	SRC000000000000005	脐橙	70-80mm	江西赣州	\N	2024-11-20	2025-02-20	40000.00	35000.00	5.80	5.50	500.00	1	["orange1.jpg"]	\N	赣南脐橙，汁多味甜	2	全国包邮	50.00	1	\N	\N	\N	1	445	89	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
96	53	301	SRC000000000000006	砂糖橘	小果	广东肇庆	\N	2024-12-05	2025-02-05	50000.00	46000.00	6.80	6.50	500.00	0	["mandarin1.jpg"]	\N	砂糖橘，皮薄易剥	2	全国包邮	100.00	1	\N	\N	\N	1	512	103	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
97	54	301	SRC000000000000007	柚子	红心柚	福建漳州	\N	2024-10-25	2025-01-25	35000.00	32000.00	4.80	4.50	500.00	1	["pomelo1.jpg"]	\N	红心蜜柚	2	全国包邮	100.00	1	\N	\N	\N	1	367	72	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
98	54	301	SRC000000000000008	柠檬	尤力克	四川安岳	\N	2024-11-01	2025-05-01	25000.00	23000.00	8.00	7.50	300.00	1	["lemon1.jpg"]	\N	安岳柠檬	2	全国包邮	50.00	1	\N	\N	\N	1	356	71	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
99	55	102	SRC000000000000009	糙米	有机	湖南益阳	\N	2024-10-15	2025-10-15	20000.00	19000.00	7.50	7.20	500.00	1	["brownrice1.jpg"]	\N	有机糙米	2	全国包邮	100.00	1	\N	\N	\N	1	234	48	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
100	55	101	SRC000000000000010	春小麦	二级	河北石家庄	\N	2024-06-20	2025-06-20	40000.00	38000.00	2.60	2.40	1000.00	1	["wheat3.jpg"]	\N	春小麦	1	省内包邮	200.00	1	\N	\N	\N	1	89	12	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
101	51	201	SRC000000000000011	小白菜	上海青	上海崇明	\N	2024-11-23	2024-12-08	8000.00	7500.00	5.00	4.80	100.00	0	["bokchoy1.jpg"]	\N	崇明小白菜	1	上海市内包邮	30.00	1	\N	\N	\N	1	189	37	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
102	52	201	SRC000000000000012	茄子	长茄	河南新乡	\N	2024-11-12	2024-12-12	12000.00	11000.00	3.80	3.50	200.00	1	["eggplant1.jpg"]	\N	紫长茄	1	河南省内包邮	50.00	1	\N	\N	\N	1	145	28	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
103	53	301	SRC000000000000013	樱桃	大樱桃	山东烟台	\N	2024-05-20	2024-06-20	8000.00	6500.00	45.00	42.00	100.00	1	["cherry1.jpg"]	\N	烟台大樱桃	3	冷链配送	20.00	1	\N	\N	\N	1	678	134	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
104	54	201	SRC000000000000014	黄瓜	水果黄瓜	辽宁沈阳	\N	2024-11-18	2024-12-18	15000.00	14000.00	5.50	5.20	200.00	0	["cucumber1.jpg"]	\N	水果黄瓜	1	东北三省包邮	50.00	1	\N	\N	\N	1	223	47	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
105	55	201	SRC000000000000015	胡萝卜	中等	山东济宁	\N	2024-10-20	2025-04-20	60000.00	55000.00	3.00	2.80	1000.00	1	["carrot1.jpg"]	\N	沙地胡萝卜	2	按重量计费	200.00	1	\N	\N	\N	1	278	54	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
\.


--
-- Data for Name: mall_operation_log; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_operation_log (log_id, user_id, user_name, operation_type, operation_module, operation_content, operation_obj_id, operation_ip, operation_time) FROM stdin;
\.


--
-- Data for Name: mall_order_aftersale; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_order_aftersale (aftersale_id, order_id, item_id, aftersale_type, apply_amount, reason, proof_images, apply_user, apply_time, audit_status, audit_user, audit_time, audit_remark, refund_time, refund_no, aftersale_status, create_time, update_time) FROM stdin;
\.


--
-- Data for Name: mall_order_invoice; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_order_invoice (invoice_id, invoice_no, order_id, buyer_id, invoice_type, invoice_title, taxpayer_id, invoice_amount, tax_rate, tax_amount, invoice_content, invoice_status, apply_time, issue_time, invoice_url, delivery_way, logistics_company, logistics_no, receive_time, fail_reason, red_invoice_no, create_user, create_time, update_time) FROM stdin;
\.


--
-- Data for Name: mall_order_item; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_order_item (item_id, order_id, item_no, source_id, product_name, product_spec, item_quantity, unit_price, item_amount, discount_amount, freight_amount, item_pay_amount, delivery_status, logistics_company, logistics_no, delivery_time, receive_time, create_time, update_time) FROM stdin;
27	ORD001	ITMORD001	55	有机小麦	50kg/袋	2000.00	2.85	5700.00	0.00	100.00	5800.00	0	\N	\N	\N	\N	2025-11-28 04:07:29.110917+08	2025-11-28 04:07:29.110917+08
28	ORD004	ITMORD004	58	优质玉米	50kg/袋	1500.00	2.50	3750.00	0.00	80.00	3830.00	0	\N	\N	\N	\N	2025-11-28 04:07:29.110917+08	2025-11-28 04:07:29.110917+08
29	ORD005	ITMORD005	59	新鲜生菜	3kg/箱	200.00	5.00	1000.00	0.00	20.00	1020.00	2	\N	\N	\N	\N	2025-11-28 04:07:29.110917+08	2025-11-28 04:07:29.110917+08
30	ORD002	ITMORD002	56	新鲜番茄	10kg/箱	500.00	3.50	1750.00	0.00	50.00	1800.00	1	顺丰速运	SF1234567890	2025-11-26 23:48:16.915305+08	\N	2025-11-28 04:07:29.110917+08	2025-11-28 04:07:29.110917+08
31	ORD003	ITMORD003	57	有机黄瓜	5kg/箱	300.00	4.20	1260.00	0.00	30.00	1290.00	2	德邦物流	DB9876543210	2025-11-25 23:48:16.915305+08	2025-11-27 17:48:16.915305+08	2025-11-28 04:07:29.110917+08	2025-11-28 04:07:29.110917+08
32	ORD20241120001	ITMORD20241120001	91	优质小麦	一级	1000.00	2.80	2800.00	100.00	50.00	2750.00	3	顺丰速运	SF1234567890	2024-11-21 09:00:00+08	2024-11-23 14:20:00+08	2025-11-28 04:07:29.110917+08	2025-11-28 04:07:29.110917+08
33	ORD20241119001	ITMORD20241119001	92	有机大米	特级	500.00	6.50	3250.00	0.00	0.00	3250.00	3	德邦物流	DB9876543210	2024-11-20 08:30:00+08	2024-11-22 16:45:00+08	2025-11-28 04:07:29.110917+08	2025-11-28 04:07:29.110917+08
34	ORD20241125001	ITMORD20241125001	95	脐橙	70-80mm	500.00	5.80	2900.00	150.00	0.00	2750.00	1	顺丰速运	SF2345678901	2024-11-26 08:00:00+08	\N	2025-11-28 04:07:29.110917+08	2025-11-28 04:07:29.110917+08
35	ORD20241126001	ITMORD20241126001	93	有机菠菜	500g/把	100.00	8.00	800.00	0.00	0.00	800.00	0	\N	\N	\N	\N	2025-11-28 04:07:29.110917+08	2025-11-28 04:07:29.110917+08
36	ORD20241127001	ITMORD20241127001	96	砂糖橘	小果	100.00	6.80	680.00	0.00	50.00	730.00	0	\N	\N	\N	\N	2025-11-28 04:07:29.110917+08	2025-11-28 04:07:29.110917+08
37	ORD20241115001	ITMORD20241115001	97	柚子	红心柚	500.00	4.80	2400.00	0.00	0.00	2400.00	3	顺丰速运	SF4567890123	2024-11-16 09:00:00+08	2024-11-18 15:30:00+08	2025-11-28 04:07:29.110917+08	2025-11-28 04:07:29.110917+08
38	ORD20241118001	ITMORD20241118001	99	糙米	有机	500.00	7.50	3750.00	0.00	0.00	3750.00	3	德邦物流	DB1122334455	2024-11-19 10:00:00+08	2024-11-21 11:30:00+08	2025-11-28 04:07:29.110917+08	2025-11-28 04:07:29.110917+08
39	ORD20241124001	ITMORD20241124001	101	小白菜	上海青	100.00	5.00	500.00	0.00	20.00	520.00	1	韵达快递	YD3456789012	2024-11-25 10:20:00+08	\N	2025-11-28 04:07:29.110917+08	2025-11-28 04:07:29.110917+08
\.


--
-- Data for Name: mall_order_main; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_order_main (order_id, buyer_id, seller_id, source_id, demand_id, match_id, order_type, order_status, payment_status, delivery_status, total_quantity, unit_price, total_amount, discount_amount, freight_amount, tax_amount, pay_amount, payment_type, payment_time, payment_no, delivery_type, logistics_company, logistics_no, receiver_address_id, delivery_time, receive_time, order_remark, create_time, update_time) FROM stdin;
ORD001	1	1	55	\N	\N	1	1	1	0	2000.00	2.85	5700.00	0.00	100.00	0.00	5800.00	\N	2025-11-27 17:58:16.915305	\N	2	\N	\N	1	\N	\N	\N	2025-11-27 17:48:16.915305	2025-11-27 19:48:16.915305
ORD004	1	2	58	\N	\N	1	1	1	0	1500.00	2.50	3750.00	0.00	80.00	0.00	3830.00	\N	2025-11-24 20:48:16.915305	\N	2	\N	\N	1	\N	\N	\N	2025-11-24 19:48:16.915305	2025-11-27 19:48:16.915305
ORD005	1	2	59	\N	\N	1	3	1	2	200.00	5.00	1000.00	0.00	20.00	0.00	1020.00	\N	2025-11-23 20:48:16.915305	\N	2	\N	\N	1	\N	\N	\N	2025-11-23 19:48:16.915305	2025-11-27 19:48:16.915305
ORD002	1	1	56	\N	\N	1	2	1	1	500.00	3.50	1750.00	0.00	50.00	0.00	1800.00	\N	2025-11-26 20:48:16.915305	\N	2	顺丰速运	SF1234567890	1	2025-11-26 23:48:16.915305	\N	\N	2025-11-26 19:48:16.915305	2025-11-27 19:48:16.915305
ORD003	1	1	57	\N	\N	1	3	1	2	300.00	4.20	1260.00	0.00	30.00	0.00	1290.00	\N	2025-11-25 20:48:16.915305	\N	2	德邦物流	DB9876543210	1	2025-11-25 23:48:16.915305	2025-11-27 17:48:16.915305	\N	2025-11-25 19:48:16.915305	2025-11-27 19:48:16.915305
ORD20241120001	56	51	91	\N	\N	1	4	1	3	1000.00	2.80	2800.00	100.00	50.00	0.00	2750.00	1	2024-11-20 10:30:00	PAY20241120001	1	顺丰速运	SF1234567890	63	2024-11-21 09:00:00	2024-11-23 14:20:00	请尽快发货	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
ORD20241119001	57	51	92	\N	\N	1	4	1	3	500.00	6.50	3250.00	0.00	0.00	0.00	3250.00	2	2024-11-19 15:20:00	PAY20241119001	2	德邦物流	DB9876543210	64	2024-11-20 08:30:00	2024-11-22 16:45:00	\N	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
ORD20241125001	58	53	95	\N	\N	1	2	1	1	500.00	5.80	2900.00	150.00	0.00	0.00	2750.00	1	2024-11-25 09:15:00	PAY20241125001	2	顺丰速运	SF2345678901	65	2024-11-26 08:00:00	\N	请包装好	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
ORD20241126001	59	52	93	\N	\N	1	1	1	0	100.00	8.00	800.00	0.00	0.00	0.00	800.00	2	2024-11-26 16:45:00	PAY20241126001	1	\N	\N	66	\N	\N	尽快发货	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
ORD20241127001	60	53	96	\N	\N	1	0	0	0	100.00	6.80	680.00	0.00	50.00	0.00	730.00	\N	\N	\N	2	\N	\N	67	\N	\N	需要新鲜	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
ORD20241115001	56	54	97	\N	\N	1	4	1	3	500.00	4.80	2400.00	0.00	0.00	0.00	2400.00	1	2024-11-15 10:00:00	PAY20241115001	2	顺丰速运	SF4567890123	63	2024-11-16 09:00:00	2024-11-18 15:30:00	\N	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
ORD20241118001	57	55	99	\N	\N	1	4	1	3	500.00	7.50	3750.00	0.00	0.00	0.00	3750.00	1	2024-11-18 14:20:00	PAY20241118001	2	德邦物流	DB1122334455	64	2024-11-19 10:00:00	2024-11-21 11:30:00	\N	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
ORD20241124001	58	51	101	\N	\N	1	2	1	1	100.00	5.00	500.00	0.00	20.00	0.00	520.00	1	2024-11-24 14:30:00	PAY20241124001	1	韵达快递	YD3456789012	65	2024-11-25 10:20:00	\N	\N	2025-11-28 04:07:29.110917	2025-11-28 04:07:29.110917
\.


--
-- Data for Name: mall_product_category; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_product_category (category_id, parent_id, category_name, category_code, category_icon, sort, status, create_time, update_time) FROM stdin;
1	0	粮食作物	GRAIN	\N	1	1	2025-11-27 18:34:12.964992	2025-11-27 18:34:12.964992
102	1	大米	RICE	\N	2	1	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
3	0	水果	FRUIT	\N	3	1	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
301	3	柑橘	CITRUS	\N	1	1	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
101	1	小麦	GRAIN-WHEAT	\N	1	1	2025-11-27 19:48:16.915305	2025-11-27 19:48:16.915305
2	0	蔬菜	VEGETABLE	\N	2	1	2025-11-27 19:48:16.915305	2025-11-27 19:48:16.915305
201	2	茄果类	VEG-FRUIT	\N	1	1	2025-11-27 19:48:16.915305	2025-11-27 19:48:16.915305
202	2	瓜类	VEG-MELON	\N	2	1	2025-11-27 19:48:16.915305	2025-11-27 19:48:16.915305
203	2	叶菜类	VEG-LEAF	\N	3	1	2025-11-27 19:48:16.915305	2025-11-27 19:48:16.915305
\.


--
-- Data for Name: mall_product_price_stat; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_product_price_stat (stat_id, category_id, product_name, stat_date, avg_price, max_price, min_price, price_trend, trend_rate, supply_quantity, demand_quantity, create_time) FROM stdin;
\.


--
-- Data for Name: mall_shopping_cart; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_shopping_cart (cart_id, user_id, source_id, quantity, create_time, update_time) FROM stdin;
12	1	55	100	2025-11-27 19:48:16.915305	2025-11-27 19:48:16.915305
13	1	56	100	2025-11-27 19:48:16.915305	2025-11-27 19:48:16.915305
14	23	55	3	2025-11-27 19:48:52.38978	2025-11-27 19:53:47.045967
15	23	56	7	2025-11-27 19:53:59.31563	2025-11-27 19:59:59.327186
16	23	57	1	2025-11-27 20:28:43.587396	2025-11-27 20:28:43.587396
\.


--
-- Data for Name: mall_supply_demand_match; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_supply_demand_match (match_id, match_no, demand_id, source_id, buyer_id, seller_id, match_score, match_quantity, match_price, match_time, match_type, match_status, confirm_time, cancel_time, cancel_reason, order_id, create_time, update_time) FROM stdin;
\.


--
-- Data for Name: mall_user_collection; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_user_collection (collection_id, user_id, collection_type, source_id, demand_id, collection_name, collection_time, is_valid, cancel_time) FROM stdin;
13	1	1	55	\N	有机小麦	2025-11-27 19:48:16.915305+08	1	\N
14	1	1	56	\N	新鲜番茄	2025-11-27 19:48:16.915305+08	1	\N
15	1	1	57	\N	有机黄瓜	2025-11-27 19:48:16.915305+08	1	\N
\.


--
-- Data for Name: mall_user_coupon; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_user_coupon (user_coupon_id, rule_id, user_id, coupon_no, obtain_time, valid_start_time, valid_end_time, use_status, use_time, order_id, actual_discount, expire_remind_time) FROM stdin;
\.


--
-- Data for Name: mall_user_follow; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_user_follow (follow_id, user_id, seller_id, follow_time, follow_status, cancel_time, seller_name, source_count, avg_score, follow_remark) FROM stdin;
5	1	2	2025-11-27 19:48:16.915305+08	1	\N	李四农场	2	5.00	\N
6	23	1	2025-11-27 21:02:13.016493+08	1	\N	张三	3	5.00	\N
\.


--
-- Data for Name: mall_user_footprint; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.mall_user_footprint (footprint_id, user_id, view_type, view_obj_id, view_obj_name, view_time, view_duration, view_ip, view_device, is_deleted, delete_time) FROM stdin;
21	1	1	55	有机小麦	2025-11-27 18:48:16.915305+08	0	\N	\N	0	\N
22	1	1	56	新鲜番茄	2025-11-27 17:48:16.915305+08	0	\N	\N	0	\N
23	1	1	57	有机黄瓜	2025-11-27 16:48:16.915305+08	0	\N	\N	0	\N
24	1	1	58	优质玉米	2025-11-27 15:48:16.915305+08	0	\N	\N	0	\N
25	1	1	59	新鲜生菜	2025-11-27 14:48:16.915305+08	0	\N	\N	0	\N
\.


--
-- Data for Name: prediction_logs; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.prediction_logs (id, task_name, start_time, end_time, status, products_count, predictions_count, error_message, created_at) FROM stdin;
1	daily_price_prediction	2025-11-27 22:31:41.072457	2025-11-27 22:36:59.705863	success	31	186	\N	2025-11-27 22:31:41.072457
\.


--
-- Data for Name: price_forecasts; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.price_forecasts (id, product_name, product_category, region, forecast_period, forecast_month, predicted_price, confidence_level, prediction_date, model_version, created_at, updated_at) FROM stdin;
1	土豆	蔬菜	全国	第1期	2025-12	3.67	84.88	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
2	土豆	蔬菜	全国	第2期	2026-01	4.11	79.88	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
3	土豆	蔬菜	全国	第3期	2026-02	4.30	74.88	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
4	大米	粮食	全国	第1期	2025-12	8.15	84.80	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
5	大米	粮食	全国	第2期	2026-01	8.67	79.80	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
6	大米	粮食	全国	第3期	2026-02	9.20	74.80	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
7	大豆	粮食	全国	第1期	2025-12	8.47	84.78	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
8	大豆	粮食	全国	第2期	2026-01	9.00	79.78	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
9	大豆	粮食	全国	第3期	2026-02	9.49	74.78	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
10	小麦	粮食	全国	第1期	2025-12	6.45	84.82	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
11	小麦	粮食	全国	第2期	2026-01	7.29	79.82	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
12	小麦	粮食	全国	第3期	2026-02	8.03	74.82	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
13	橙子	水果	全国	第1期	2025-12	10.11	84.74	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
14	橙子	水果	全国	第2期	2026-01	10.69	79.74	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
15	橙子	水果	全国	第3期	2026-02	11.52	74.74	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
16	牛肉	肉类	全国	第1期	2025-12	79.60	82.51	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
17	牛肉	肉类	全国	第2期	2026-01	92.86	77.51	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
18	牛肉	肉类	全国	第3期	2026-02	96.50	72.51	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
19	猪肉	肉类	全国	第1期	2025-12	38.51	84.06	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
20	猪肉	肉类	全国	第2期	2026-01	39.52	79.06	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
21	猪肉	肉类	全国	第3期	2026-02	42.30	74.06	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
22	玉米	粮食	全国	第1期	2025-12	4.32	84.88	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
23	玉米	粮食	全国	第2期	2026-01	4.36	79.88	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
24	玉米	粮食	全国	第3期	2026-02	4.80	74.88	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
25	番茄	蔬菜	全国	第1期	2025-12	6.42	84.78	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
26	番茄	蔬菜	全国	第2期	2026-01	7.30	79.78	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
27	番茄	蔬菜	全国	第3期	2026-02	7.86	74.78	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
28	白菜	蔬菜	全国	第1期	2025-12	3.60	84.90	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
29	白菜	蔬菜	全国	第2期	2026-01	3.86	79.90	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
30	白菜	蔬菜	全国	第3期	2026-02	4.12	74.90	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
31	苹果	水果	全国	第1期	2025-12	10.07	84.71	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
32	苹果	水果	全国	第2期	2026-01	11.66	79.71	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
33	苹果	水果	全国	第3期	2026-02	12.17	74.71	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
34	香蕉	水果	全国	第1期	2025-12	9.05	84.78	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
35	香蕉	水果	全国	第2期	2026-01	9.85	79.78	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
36	香蕉	水果	全国	第3期	2026-02	10.49	74.78	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
37	鸡肉	肉类	全国	第1期	2025-12	22.92	84.35	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
38	鸡肉	肉类	全国	第2期	2026-01	26.16	79.35	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
39	鸡肉	肉类	全国	第3期	2026-02	25.97	74.35	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
40	鸡蛋	禽蛋	全国	第1期	2025-12	15.94	84.59	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
41	鸡蛋	禽蛋	全国	第2期	2026-01	16.41	79.59	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
42	鸡蛋	禽蛋	全国	第3期	2026-02	17.29	74.59	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
43	黄瓜	蔬菜	全国	第1期	2025-12	5.39	84.85	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
44	黄瓜	蔬菜	全国	第2期	2026-01	5.84	79.85	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
45	黄瓜	蔬菜	全国	第3期	2026-02	6.39	74.85	2025-11-27 21:50:33.511058	v1.0-timeseries	2025-11-27 21:50:33.511058	2025-11-27 21:50:33.511058
\.


--
-- Data for Name: price_predictions; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.price_predictions (id, product_name, product_category, region, prediction_type, prediction_date, period_number, predicted_price, confidence_lower, confidence_upper, model_type, accuracy_score, created_at, updated_at) FROM stdin;
1	草鱼	水产品价格	national	monthly	2025-11-27	1	19.20	18.46	19.93	ARIMA	85.01	2025-11-27 22:36:58.279242	2025-11-27 22:36:58.279242
2	草鱼	水产品价格	national	monthly	2025-11-27	2	19.02	17.63	20.41	ARIMA	85.01	2025-11-27 22:36:58.28804	2025-11-27 22:36:58.28804
3	草鱼	水产品价格	national	monthly	2025-11-27	3	18.91	16.90	20.91	ARIMA	85.01	2025-11-27 22:36:58.295269	2025-11-27 22:36:58.295269
4	草鱼	水产品价格	national	monthly	2025-11-27	1	19.48	17.50	21.46	LSTM	\N	2025-11-27 22:36:58.301503	2025-11-27 22:36:58.301503
5	草鱼	水产品价格	national	monthly	2025-11-27	2	19.44	17.45	21.42	LSTM	\N	2025-11-27 22:36:58.308171	2025-11-27 22:36:58.308171
6	草鱼	水产品价格	national	monthly	2025-11-27	3	19.53	17.54	21.51	LSTM	\N	2025-11-27 22:36:58.31489	2025-11-27 22:36:58.31489
7	鲤鱼	水产品价格	national	monthly	2025-11-27	1	15.40	15.12	15.67	ARIMA	101.25	2025-11-27 22:36:58.321381	2025-11-27 22:36:58.321381
8	鲤鱼	水产品价格	national	monthly	2025-11-27	2	15.30	14.94	15.66	ARIMA	101.25	2025-11-27 22:36:58.327659	2025-11-27 22:36:58.327659
9	鲤鱼	水产品价格	national	monthly	2025-11-27	3	15.37	14.93	15.81	ARIMA	101.25	2025-11-27 22:36:58.337627	2025-11-27 22:36:58.337627
10	鲤鱼	水产品价格	national	monthly	2025-11-27	1	15.84	15.19	16.48	LSTM	\N	2025-11-27 22:36:58.346195	2025-11-27 22:36:58.346195
11	鲤鱼	水产品价格	national	monthly	2025-11-27	2	15.80	15.16	16.45	LSTM	\N	2025-11-27 22:36:58.354898	2025-11-27 22:36:58.354898
12	鲤鱼	水产品价格	national	monthly	2025-11-27	3	15.81	15.17	16.46	LSTM	\N	2025-11-27 22:36:58.363317	2025-11-27 22:36:58.363317
13	鲢鱼	水产品价格	national	monthly	2025-11-27	1	13.14	12.82	13.33	ARIMA	109.28	2025-11-27 22:36:58.371873	2025-11-27 22:36:58.371873
14	鲢鱼	水产品价格	national	monthly	2025-11-27	2	13.09	12.52	13.62	ARIMA	109.28	2025-11-27 22:36:58.378367	2025-11-27 22:36:58.378367
15	鲢鱼	水产品价格	national	monthly	2025-11-27	3	13.05	12.33	13.81	ARIMA	109.28	2025-11-27 22:36:58.385487	2025-11-27 22:36:58.385487
16	鲢鱼	水产品价格	national	monthly	2025-11-27	1	13.19	12.60	13.78	LSTM	\N	2025-11-27 22:36:58.392287	2025-11-27 22:36:58.392287
17	鲢鱼	水产品价格	national	monthly	2025-11-27	2	13.22	12.63	13.81	LSTM	\N	2025-11-27 22:36:58.398458	2025-11-27 22:36:58.398458
18	鲢鱼	水产品价格	national	monthly	2025-11-27	3	13.24	12.66	13.83	LSTM	\N	2025-11-27 22:36:58.404758	2025-11-27 22:36:58.404758
19	带鱼	水产品价格	national	monthly	2025-11-27	1	33.70	33.08	34.26	ARIMA	90.66	2025-11-27 22:36:58.411521	2025-11-27 22:36:58.411521
20	带鱼	水产品价格	national	monthly	2025-11-27	2	33.69	32.93	34.40	ARIMA	90.66	2025-11-27 22:36:58.417775	2025-11-27 22:36:58.417775
21	带鱼	水产品价格	national	monthly	2025-11-27	3	33.67	32.81	34.52	ARIMA	90.66	2025-11-27 22:36:58.424533	2025-11-27 22:36:58.424533
22	带鱼	水产品价格	national	monthly	2025-11-27	1	33.68	33.02	34.35	LSTM	\N	2025-11-27 22:36:58.431268	2025-11-27 22:36:58.431268
23	带鱼	水产品价格	national	monthly	2025-11-27	2	33.67	33.01	34.34	LSTM	\N	2025-11-27 22:36:58.437559	2025-11-27 22:36:58.437559
24	带鱼	水产品价格	national	monthly	2025-11-27	3	33.67	33.01	34.34	LSTM	\N	2025-11-27 22:36:58.445626	2025-11-27 22:36:58.445626
25	棉花[籽棉]	经济作物价格	national	monthly	2025-11-27	1	7.33	7.26	7.41	ARIMA	142.03	2025-11-27 22:36:58.453328	2025-11-27 22:36:58.453328
26	棉花[籽棉]	经济作物价格	national	monthly	2025-11-27	2	7.35	7.27	7.43	ARIMA	142.03	2025-11-27 22:36:58.474279	2025-11-27 22:36:58.474279
27	棉花[籽棉]	经济作物价格	national	monthly	2025-11-27	3	7.36	7.28	7.44	ARIMA	142.03	2025-11-27 22:36:58.481383	2025-11-27 22:36:58.481383
28	棉花[籽棉]	经济作物价格	national	monthly	2025-11-27	1	7.34	7.26	7.42	LSTM	\N	2025-11-27 22:36:58.487951	2025-11-27 22:36:58.487951
29	棉花[籽棉]	经济作物价格	national	monthly	2025-11-27	2	7.32	7.24	7.40	LSTM	\N	2025-11-27 22:36:58.494281	2025-11-27 22:36:58.494281
30	棉花[籽棉]	经济作物价格	national	monthly	2025-11-27	3	7.32	7.24	7.39	LSTM	\N	2025-11-27 22:36:58.500448	2025-11-27 22:36:58.500448
31	花生仁	经济作物价格	national	monthly	2025-11-27	1	13.82	13.71	13.98	ARIMA	125.46	2025-11-27 22:36:58.506283	2025-11-27 22:36:58.506283
32	花生仁	经济作物价格	national	monthly	2025-11-27	2	13.79	13.63	14.06	ARIMA	125.46	2025-11-27 22:36:58.512527	2025-11-27 22:36:58.512527
33	花生仁	经济作物价格	national	monthly	2025-11-27	3	13.75	13.57	14.12	ARIMA	125.46	2025-11-27 22:36:58.518876	2025-11-27 22:36:58.518876
34	花生仁	经济作物价格	national	monthly	2025-11-27	1	13.92	13.69	14.15	LSTM	\N	2025-11-27 22:36:58.525213	2025-11-27 22:36:58.525213
35	花生仁	经济作物价格	national	monthly	2025-11-27	2	13.97	13.74	14.20	LSTM	\N	2025-11-27 22:36:58.531313	2025-11-27 22:36:58.531313
36	花生仁	经济作物价格	national	monthly	2025-11-27	3	13.98	13.75	14.21	LSTM	\N	2025-11-27 22:36:58.539702	2025-11-27 22:36:58.539702
37	油菜籽	经济作物价格	national	monthly	2025-11-27	1	6.33	6.25	6.42	ARIMA	135.39	2025-11-27 22:36:58.546014	2025-11-27 22:36:58.546014
38	油菜籽	经济作物价格	national	monthly	2025-11-27	2	6.32	6.19	6.44	ARIMA	135.39	2025-11-27 22:36:58.552713	2025-11-27 22:36:58.552713
39	油菜籽	经济作物价格	national	monthly	2025-11-27	3	6.31	6.17	6.44	ARIMA	135.39	2025-11-27 22:36:58.559962	2025-11-27 22:36:58.559962
40	油菜籽	经济作物价格	national	monthly	2025-11-27	1	6.34	6.20	6.48	LSTM	\N	2025-11-27 22:36:58.56595	2025-11-27 22:36:58.56595
41	油菜籽	经济作物价格	national	monthly	2025-11-27	2	6.34	6.20	6.48	LSTM	\N	2025-11-27 22:36:58.572063	2025-11-27 22:36:58.572063
42	油菜籽	经济作物价格	national	monthly	2025-11-27	3	6.34	6.20	6.48	LSTM	\N	2025-11-27 22:36:58.578549	2025-11-27 22:36:58.578549
43	红富士苹果	水果价格	national	monthly	2025-11-27	1	12.14	11.39	12.16	ARIMA	99.10	2025-11-27 22:36:58.585569	2025-11-27 22:36:58.585569
44	红富士苹果	水果价格	national	monthly	2025-11-27	2	12.02	10.93	12.62	ARIMA	99.10	2025-11-27 22:36:58.592956	2025-11-27 22:36:58.592956
45	红富士苹果	水果价格	national	monthly	2025-11-27	3	11.90	10.65	12.90	ARIMA	99.10	2025-11-27 22:36:58.599466	2025-11-27 22:36:58.599466
46	红富士苹果	水果价格	national	monthly	2025-11-27	1	12.40	11.05	13.74	LSTM	\N	2025-11-27 22:36:58.605372	2025-11-27 22:36:58.605372
47	红富士苹果	水果价格	national	monthly	2025-11-27	2	12.38	11.03	13.73	LSTM	\N	2025-11-27 22:36:58.611779	2025-11-27 22:36:58.611779
48	红富士苹果	水果价格	national	monthly	2025-11-27	3	12.39	11.05	13.74	LSTM	\N	2025-11-27 22:36:58.618808	2025-11-27 22:36:58.618808
49	香蕉	水果价格	national	monthly	2025-11-27	1	5.96	5.77	6.72	ARIMA	94.28	2025-11-27 22:36:58.625268	2025-11-27 22:36:58.625268
50	香蕉	水果价格	national	monthly	2025-11-27	2	5.67	5.22	7.28	ARIMA	94.28	2025-11-27 22:36:58.632258	2025-11-27 22:36:58.632258
51	香蕉	水果价格	national	monthly	2025-11-27	3	5.39	4.87	7.63	ARIMA	94.28	2025-11-27 22:36:58.638075	2025-11-27 22:36:58.638075
52	香蕉	水果价格	national	monthly	2025-11-27	1	6.93	5.88	7.98	LSTM	\N	2025-11-27 22:36:58.644703	2025-11-27 22:36:58.644703
53	香蕉	水果价格	national	monthly	2025-11-27	2	6.93	5.88	7.99	LSTM	\N	2025-11-27 22:36:58.651604	2025-11-27 22:36:58.651604
54	香蕉	水果价格	national	monthly	2025-11-27	3	7.00	5.94	8.05	LSTM	\N	2025-11-27 22:36:58.65815	2025-11-27 22:36:58.65815
55	橙子	水果价格	national	monthly	2025-11-27	1	11.36	11.13	11.59	ARIMA	101.78	2025-11-27 22:36:58.664827	2025-11-27 22:36:58.664827
56	橙子	水果价格	national	monthly	2025-11-27	2	11.02	10.72	11.32	ARIMA	101.78	2025-11-27 22:36:58.670806	2025-11-27 22:36:58.670806
57	橙子	水果价格	national	monthly	2025-11-27	3	10.63	10.32	10.95	ARIMA	101.78	2025-11-27 22:36:58.677089	2025-11-27 22:36:58.677089
58	橙子	水果价格	national	monthly	2025-11-27	1	11.94	10.69	13.18	LSTM	\N	2025-11-27 22:36:58.683788	2025-11-27 22:36:58.683788
59	橙子	水果价格	national	monthly	2025-11-27	2	12.10	10.85	13.35	LSTM	\N	2025-11-27 22:36:58.690282	2025-11-27 22:36:58.690282
60	橙子	水果价格	national	monthly	2025-11-27	3	12.55	11.30	13.80	LSTM	\N	2025-11-27 22:36:58.696636	2025-11-27 22:36:58.696636
61	籼稻	粮食价格	national	monthly	2025-11-27	1	2.90	2.89	2.91	ARIMA	192.20	2025-11-27 22:36:58.702868	2025-11-27 22:36:58.702868
62	籼稻	粮食价格	national	monthly	2025-11-27	2	2.90	2.88	2.92	ARIMA	192.20	2025-11-27 22:36:58.710926	2025-11-27 22:36:58.710926
63	籼稻	粮食价格	national	monthly	2025-11-27	3	2.91	2.88	2.93	ARIMA	192.20	2025-11-27 22:36:58.718398	2025-11-27 22:36:58.718398
64	籼稻	粮食价格	national	monthly	2025-11-27	1	2.92	2.89	2.94	LSTM	\N	2025-11-27 22:36:58.724793	2025-11-27 22:36:58.724793
65	籼稻	粮食价格	national	monthly	2025-11-27	2	2.91	2.89	2.94	LSTM	\N	2025-11-27 22:36:58.731349	2025-11-27 22:36:58.731349
66	籼稻	粮食价格	national	monthly	2025-11-27	3	2.91	2.89	2.94	LSTM	\N	2025-11-27 22:36:58.737693	2025-11-27 22:36:58.737693
67	粳稻	粮食价格	national	monthly	2025-11-27	1	3.18	3.15	3.21	ARIMA	161.27	2025-11-27 22:36:58.743886	2025-11-27 22:36:58.743886
68	粳稻	粮食价格	national	monthly	2025-11-27	2	3.18	3.15	3.21	ARIMA	161.27	2025-11-27 22:36:58.750084	2025-11-27 22:36:58.750084
69	粳稻	粮食价格	national	monthly	2025-11-27	3	3.17	3.15	3.21	ARIMA	161.27	2025-11-27 22:36:58.756282	2025-11-27 22:36:58.756282
70	粳稻	粮食价格	national	monthly	2025-11-27	1	3.18	3.13	3.23	LSTM	\N	2025-11-27 22:36:58.762697	2025-11-27 22:36:58.762697
71	粳稻	粮食价格	national	monthly	2025-11-27	2	3.18	3.13	3.23	LSTM	\N	2025-11-27 22:36:58.769499	2025-11-27 22:36:58.769499
72	粳稻	粮食价格	national	monthly	2025-11-27	3	3.18	3.14	3.23	LSTM	\N	2025-11-27 22:36:58.775572	2025-11-27 22:36:58.775572
73	小麦	粮食价格	national	monthly	2025-11-27	1	2.82	2.80	2.84	ARIMA	176.50	2025-11-27 22:36:58.781971	2025-11-27 22:36:58.781971
74	小麦	粮食价格	national	monthly	2025-11-27	2	2.82	2.79	2.84	ARIMA	176.50	2025-11-27 22:36:58.788212	2025-11-27 22:36:58.788212
75	小麦	粮食价格	national	monthly	2025-11-27	3	2.82	2.79	2.84	ARIMA	176.50	2025-11-27 22:36:58.794861	2025-11-27 22:36:58.794861
76	小麦	粮食价格	national	monthly	2025-11-27	1	2.81	2.79	2.83	LSTM	\N	2025-11-27 22:36:58.801062	2025-11-27 22:36:58.801062
77	小麦	粮食价格	national	monthly	2025-11-27	2	2.81	2.79	2.83	LSTM	\N	2025-11-27 22:36:58.810404	2025-11-27 22:36:58.810404
78	小麦	粮食价格	national	monthly	2025-11-27	3	2.81	2.79	2.83	LSTM	\N	2025-11-27 22:36:58.822801	2025-11-27 22:36:58.822801
79	玉米	粮食价格	national	monthly	2025-11-27	1	2.41	2.40	2.43	ARIMA	170.39	2025-11-27 22:36:58.829445	2025-11-27 22:36:58.829445
80	玉米	粮食价格	national	monthly	2025-11-27	2	2.38	2.36	2.39	ARIMA	170.39	2025-11-27 22:36:58.836382	2025-11-27 22:36:58.836382
81	玉米	粮食价格	national	monthly	2025-11-27	3	2.36	2.34	2.37	ARIMA	170.39	2025-11-27 22:36:58.843165	2025-11-27 22:36:58.843165
82	玉米	粮食价格	national	monthly	2025-11-27	1	2.48	2.36	2.61	LSTM	\N	2025-11-27 22:36:58.849658	2025-11-27 22:36:58.849658
83	玉米	粮食价格	national	monthly	2025-11-27	2	2.47	2.35	2.60	LSTM	\N	2025-11-27 22:36:58.857011	2025-11-27 22:36:58.857011
84	玉米	粮食价格	national	monthly	2025-11-27	3	2.47	2.34	2.60	LSTM	\N	2025-11-27 22:36:58.863132	2025-11-27 22:36:58.863132
85	大豆	粮食价格	national	monthly	2025-11-27	1	7.13	7.08	7.17	ARIMA	151.71	2025-11-27 22:36:58.869154	2025-11-27 22:36:58.869154
86	大豆	粮食价格	national	monthly	2025-11-27	2	7.10	7.01	7.19	ARIMA	151.71	2025-11-27 22:36:58.875297	2025-11-27 22:36:58.875297
87	大豆	粮食价格	national	monthly	2025-11-27	3	7.08	6.94	7.22	ARIMA	151.71	2025-11-27 22:36:58.88322	2025-11-27 22:36:58.88322
88	大豆	粮食价格	national	monthly	2025-11-27	1	7.19	7.12	7.27	LSTM	\N	2025-11-27 22:36:58.88939	2025-11-27 22:36:58.88939
89	大豆	粮食价格	national	monthly	2025-11-27	2	7.20	7.12	7.27	LSTM	\N	2025-11-27 22:36:58.895341	2025-11-27 22:36:58.895341
90	大豆	粮食价格	national	monthly	2025-11-27	3	7.20	7.12	7.28	LSTM	\N	2025-11-27 22:36:58.902438	2025-11-27 22:36:58.902438
91	籼米	粮食价格	national	monthly	2025-11-27	1	5.24	5.22	5.25	ARIMA	185.36	2025-11-27 22:36:58.908646	2025-11-27 22:36:58.908646
92	籼米	粮食价格	national	monthly	2025-11-27	2	5.24	5.22	5.26	ARIMA	185.36	2025-11-27 22:36:58.914893	2025-11-27 22:36:58.914893
93	籼米	粮食价格	national	monthly	2025-11-27	3	5.25	5.22	5.27	ARIMA	185.36	2025-11-27 22:36:58.920836	2025-11-27 22:36:58.920836
94	籼米	粮食价格	national	monthly	2025-11-27	1	5.24	5.22	5.26	LSTM	\N	2025-11-27 22:36:58.926957	2025-11-27 22:36:58.926957
95	籼米	粮食价格	national	monthly	2025-11-27	2	5.24	5.22	5.26	LSTM	\N	2025-11-27 22:36:58.933743	2025-11-27 22:36:58.933743
96	籼米	粮食价格	national	monthly	2025-11-27	3	5.24	5.22	5.26	LSTM	\N	2025-11-27 22:36:58.941437	2025-11-27 22:36:58.941437
97	粳米	粮食价格	national	monthly	2025-11-27	1	5.83	5.81	5.84	ARIMA	179.77	2025-11-27 22:36:58.949079	2025-11-27 22:36:58.949079
98	粳米	粮食价格	national	monthly	2025-11-27	2	5.82	5.80	5.84	ARIMA	179.77	2025-11-27 22:36:58.955234	2025-11-27 22:36:58.955234
99	粳米	粮食价格	national	monthly	2025-11-27	3	5.82	5.80	5.84	ARIMA	179.77	2025-11-27 22:36:58.96164	2025-11-27 22:36:58.96164
100	粳米	粮食价格	national	monthly	2025-11-27	1	5.82	5.80	5.84	LSTM	\N	2025-11-27 22:36:58.968899	2025-11-27 22:36:58.968899
101	粳米	粮食价格	national	monthly	2025-11-27	2	5.82	5.80	5.84	LSTM	\N	2025-11-27 22:36:58.974903	2025-11-27 22:36:58.974903
102	粳米	粮食价格	national	monthly	2025-11-27	3	5.82	5.80	5.84	LSTM	\N	2025-11-27 22:36:58.981282	2025-11-27 22:36:58.981282
103	活猪	畜产品价格	national	monthly	2025-11-27	1	12.98	12.33	13.62	ARIMA	87.61	2025-11-27 22:36:58.987836	2025-11-27 22:36:58.987836
104	活猪	畜产品价格	national	monthly	2025-11-27	2	12.54	11.59	13.49	ARIMA	87.61	2025-11-27 22:36:58.993995	2025-11-27 22:36:58.993995
105	活猪	畜产品价格	national	monthly	2025-11-27	3	12.11	10.91	13.31	ARIMA	87.61	2025-11-27 22:36:59.000233	2025-11-27 22:36:59.000233
106	活猪	畜产品价格	national	monthly	2025-11-27	1	14.12	11.38	16.87	LSTM	\N	2025-11-27 22:36:59.006431	2025-11-27 22:36:59.006431
107	活猪	畜产品价格	national	monthly	2025-11-27	2	13.93	11.19	16.68	LSTM	\N	2025-11-27 22:36:59.012612	2025-11-27 22:36:59.012612
108	活猪	畜产品价格	national	monthly	2025-11-27	3	13.88	11.13	16.62	LSTM	\N	2025-11-27 22:36:59.018887	2025-11-27 22:36:59.018887
109	仔猪	畜产品价格	national	monthly	2025-11-27	1	25.18	23.77	26.59	ARIMA	71.77	2025-11-27 22:36:59.025546	2025-11-27 22:36:59.025546
110	仔猪	畜产品价格	national	monthly	2025-11-27	2	22.49	18.70	26.27	ARIMA	71.77	2025-11-27 22:36:59.033873	2025-11-27 22:36:59.033873
111	仔猪	畜产品价格	national	monthly	2025-11-27	3	19.79	13.02	26.57	ARIMA	71.77	2025-11-27 22:36:59.041075	2025-11-27 22:36:59.041075
112	仔猪	畜产品价格	national	monthly	2025-11-27	1	31.72	26.20	37.25	LSTM	\N	2025-11-27 22:36:59.053503	2025-11-27 22:36:59.053503
113	仔猪	畜产品价格	national	monthly	2025-11-27	2	30.94	25.42	36.47	LSTM	\N	2025-11-27 22:36:59.073681	2025-11-27 22:36:59.073681
114	仔猪	畜产品价格	national	monthly	2025-11-27	3	30.90	25.38	36.43	LSTM	\N	2025-11-27 22:36:59.080932	2025-11-27 22:36:59.080932
115	猪肉	畜产品价格	national	monthly	2025-11-27	1	22.11	21.16	23.07	ARIMA	78.92	2025-11-27 22:36:59.088224	2025-11-27 22:36:59.088224
116	猪肉	畜产品价格	national	monthly	2025-11-27	2	21.56	20.15	22.97	ARIMA	78.92	2025-11-27 22:36:59.095517	2025-11-27 22:36:59.095517
117	猪肉	畜产品价格	national	monthly	2025-11-27	3	21.00	19.22	22.79	ARIMA	78.92	2025-11-27 22:36:59.102975	2025-11-27 22:36:59.102975
118	猪肉	畜产品价格	national	monthly	2025-11-27	1	23.45	19.75	27.15	LSTM	\N	2025-11-27 22:36:59.110023	2025-11-27 22:36:59.110023
119	猪肉	畜产品价格	national	monthly	2025-11-27	2	23.25	19.55	26.94	LSTM	\N	2025-11-27 22:36:59.11763	2025-11-27 22:36:59.11763
120	猪肉	畜产品价格	national	monthly	2025-11-27	3	23.16	19.46	26.86	LSTM	\N	2025-11-27 22:36:59.124705	2025-11-27 22:36:59.124705
121	活牛	畜产品价格	national	monthly	2025-11-27	1	28.55	27.69	29.04	ARIMA	86.73	2025-11-27 22:36:59.159201	2025-11-27 22:36:59.159201
122	活牛	畜产品价格	national	monthly	2025-11-27	2	28.70	27.00	29.73	ARIMA	86.73	2025-11-27 22:36:59.166121	2025-11-27 22:36:59.166121
123	活牛	畜产品价格	national	monthly	2025-11-27	3	28.85	26.56	30.17	ARIMA	86.73	2025-11-27 22:36:59.172491	2025-11-27 22:36:59.172491
124	活牛	畜产品价格	national	monthly	2025-11-27	1	28.42	26.44	30.40	LSTM	\N	2025-11-27 22:36:59.205526	2025-11-27 22:36:59.205526
125	活牛	畜产品价格	national	monthly	2025-11-27	2	28.53	26.54	30.51	LSTM	\N	2025-11-27 22:36:59.220292	2025-11-27 22:36:59.220292
126	活牛	畜产品价格	national	monthly	2025-11-27	3	28.59	26.61	30.58	LSTM	\N	2025-11-27 22:36:59.227446	2025-11-27 22:36:59.227446
127	牛肉	畜产品价格	national	monthly	2025-11-27	1	71.17	69.06	72.40	ARIMA	65.30	2025-11-27 22:36:59.234394	2025-11-27 22:36:59.234394
128	牛肉	畜产品价格	national	monthly	2025-11-27	2	71.58	67.52	73.94	ARIMA	65.30	2025-11-27 22:36:59.240619	2025-11-27 22:36:59.240619
129	牛肉	畜产品价格	national	monthly	2025-11-27	3	71.98	66.51	74.95	ARIMA	65.30	2025-11-27 22:36:59.247919	2025-11-27 22:36:59.247919
130	牛肉	畜产品价格	national	monthly	2025-11-27	1	71.37	66.94	75.79	LSTM	\N	2025-11-27 22:36:59.254346	2025-11-27 22:36:59.254346
131	牛肉	畜产品价格	national	monthly	2025-11-27	2	72.12	67.70	76.54	LSTM	\N	2025-11-27 22:36:59.26099	2025-11-27 22:36:59.26099
132	牛肉	畜产品价格	national	monthly	2025-11-27	3	72.83	68.41	77.25	LSTM	\N	2025-11-27 22:36:59.268328	2025-11-27 22:36:59.268328
133	活羊	畜产品价格	national	monthly	2025-11-27	1	31.49	31.06	32.01	ARIMA	96.07	2025-11-27 22:36:59.275809	2025-11-27 22:36:59.275809
134	活羊	畜产品价格	national	monthly	2025-11-27	2	31.68	30.80	32.27	ARIMA	96.07	2025-11-27 22:36:59.283736	2025-11-27 22:36:59.283736
135	活羊	畜产品价格	national	monthly	2025-11-27	3	31.88	30.61	32.46	ARIMA	96.07	2025-11-27 22:36:59.29155	2025-11-27 22:36:59.29155
136	活羊	畜产品价格	national	monthly	2025-11-27	1	31.00	30.38	31.62	LSTM	\N	2025-11-27 22:36:59.29813	2025-11-27 22:36:59.29813
137	活羊	畜产品价格	national	monthly	2025-11-27	2	31.03	30.41	31.65	LSTM	\N	2025-11-27 22:36:59.304648	2025-11-27 22:36:59.304648
138	活羊	畜产品价格	national	monthly	2025-11-27	3	31.04	30.42	31.66	LSTM	\N	2025-11-27 22:36:59.311474	2025-11-27 22:36:59.311474
139	羊肉	畜产品价格	national	monthly	2025-11-27	1	70.53	69.47	71.58	ARIMA	78.06	2025-11-27 22:36:59.317718	2025-11-27 22:36:59.317718
140	羊肉	畜产品价格	national	monthly	2025-11-27	2	71.09	69.22	72.96	ARIMA	78.06	2025-11-27 22:36:59.324491	2025-11-27 22:36:59.324491
141	羊肉	畜产品价格	national	monthly	2025-11-27	3	71.66	68.89	74.42	ARIMA	78.06	2025-11-27 22:36:59.331148	2025-11-27 22:36:59.331148
142	羊肉	畜产品价格	national	monthly	2025-11-27	1	68.89	67.27	70.52	LSTM	\N	2025-11-27 22:36:59.337196	2025-11-27 22:36:59.337196
143	羊肉	畜产品价格	national	monthly	2025-11-27	2	68.88	67.26	70.51	LSTM	\N	2025-11-27 22:36:59.344978	2025-11-27 22:36:59.344978
144	羊肉	畜产品价格	national	monthly	2025-11-27	3	68.86	67.23	70.48	LSTM	\N	2025-11-27 22:36:59.351529	2025-11-27 22:36:59.351529
145	活鸡	畜产品价格	national	monthly	2025-11-27	1	21.58	20.92	21.97	ARIMA	93.39	2025-11-27 22:36:59.358183	2025-11-27 22:36:59.358183
146	活鸡	畜产品价格	national	monthly	2025-11-27	2	21.66	20.83	22.05	ARIMA	93.39	2025-11-27 22:36:59.365926	2025-11-27 22:36:59.365926
147	活鸡	畜产品价格	national	monthly	2025-11-27	3	21.73	20.76	22.13	ARIMA	93.39	2025-11-27 22:36:59.371953	2025-11-27 22:36:59.371953
148	活鸡	畜产品价格	national	monthly	2025-11-27	1	21.45	20.89	22.01	LSTM	\N	2025-11-27 22:36:59.378634	2025-11-27 22:36:59.378634
149	活鸡	畜产品价格	national	monthly	2025-11-27	2	21.46	20.89	22.02	LSTM	\N	2025-11-27 22:36:59.384897	2025-11-27 22:36:59.384897
150	活鸡	畜产品价格	national	monthly	2025-11-27	3	21.43	20.87	21.99	LSTM	\N	2025-11-27 22:36:59.391035	2025-11-27 22:36:59.391035
151	鸡蛋	畜产品价格	national	monthly	2025-11-27	1	9.60	8.24	10.16	ARIMA	79.14	2025-11-27 22:36:59.397495	2025-11-27 22:36:59.397495
152	鸡蛋	畜产品价格	national	monthly	2025-11-27	2	9.70	7.82	10.58	ARIMA	79.14	2025-11-27 22:36:59.40416	2025-11-27 22:36:59.40416
153	鸡蛋	畜产品价格	national	monthly	2025-11-27	3	9.80	7.50	10.90	ARIMA	79.14	2025-11-27 22:36:59.413804	2025-11-27 22:36:59.413804
154	鸡蛋	畜产品价格	national	monthly	2025-11-27	1	9.36	7.57	11.15	LSTM	\N	2025-11-27 22:36:59.420759	2025-11-27 22:36:59.420759
155	鸡蛋	畜产品价格	national	monthly	2025-11-27	2	9.30	7.50	11.09	LSTM	\N	2025-11-27 22:36:59.427566	2025-11-27 22:36:59.427566
156	鸡蛋	畜产品价格	national	monthly	2025-11-27	3	9.41	7.62	11.20	LSTM	\N	2025-11-27 22:36:59.434253	2025-11-27 22:36:59.434253
157	大白菜	蔬菜价格	national	monthly	2025-11-27	1	3.40	2.64	3.61	ARIMA	95.15	2025-11-27 22:36:59.440497	2025-11-27 22:36:59.440497
158	大白菜	蔬菜价格	national	monthly	2025-11-27	2	3.53	2.27	3.96	ARIMA	95.15	2025-11-27 22:36:59.446637	2025-11-27 22:36:59.446637
159	大白菜	蔬菜价格	national	monthly	2025-11-27	3	3.66	1.96	4.25	ARIMA	95.15	2025-11-27 22:36:59.453096	2025-11-27 22:36:59.453096
160	大白菜	蔬菜价格	national	monthly	2025-11-27	1	3.16	2.52	3.80	LSTM	\N	2025-11-27 22:36:59.460427	2025-11-27 22:36:59.460427
161	大白菜	蔬菜价格	national	monthly	2025-11-27	2	3.15	2.51	3.79	LSTM	\N	2025-11-27 22:36:59.468643	2025-11-27 22:36:59.468643
162	大白菜	蔬菜价格	national	monthly	2025-11-27	3	3.15	2.50	3.79	LSTM	\N	2025-11-27 22:36:59.477682	2025-11-27 22:36:59.477682
163	黄瓜	蔬菜价格	national	monthly	2025-11-27	1	9.51	7.83	11.19	ARIMA	67.27	2025-11-27 22:36:59.484759	2025-11-27 22:36:59.484759
164	黄瓜	蔬菜价格	national	monthly	2025-11-27	2	11.25	8.57	13.92	ARIMA	67.27	2025-11-27 22:36:59.491763	2025-11-27 22:36:59.491763
165	黄瓜	蔬菜价格	national	monthly	2025-11-27	3	12.24	7.86	16.61	ARIMA	67.27	2025-11-27 22:36:59.498461	2025-11-27 22:36:59.498461
166	黄瓜	蔬菜价格	national	monthly	2025-11-27	1	6.84	4.63	9.04	LSTM	\N	2025-11-27 22:36:59.504514	2025-11-27 22:36:59.504514
167	黄瓜	蔬菜价格	national	monthly	2025-11-27	2	6.68	4.48	8.88	LSTM	\N	2025-11-27 22:36:59.511591	2025-11-27 22:36:59.511591
168	黄瓜	蔬菜价格	national	monthly	2025-11-27	3	6.10	3.90	8.30	LSTM	\N	2025-11-27 22:36:59.519335	2025-11-27 22:36:59.519335
169	西红柿	蔬菜价格	national	monthly	2025-11-27	1	9.76	8.53	10.98	ARIMA	75.12	2025-11-27 22:36:59.525998	2025-11-27 22:36:59.525998
170	西红柿	蔬菜价格	national	monthly	2025-11-27	2	11.11	8.41	13.80	ARIMA	75.12	2025-11-27 22:36:59.532198	2025-11-27 22:36:59.532198
171	西红柿	蔬菜价格	national	monthly	2025-11-27	3	12.45	7.98	16.93	ARIMA	75.12	2025-11-27 22:36:59.541992	2025-11-27 22:36:59.541992
172	西红柿	蔬菜价格	national	monthly	2025-11-27	1	6.98	4.89	9.07	LSTM	\N	2025-11-27 22:36:59.549909	2025-11-27 22:36:59.549909
173	西红柿	蔬菜价格	national	monthly	2025-11-27	2	6.92	4.83	9.00	LSTM	\N	2025-11-27 22:36:59.556948	2025-11-27 22:36:59.556948
174	西红柿	蔬菜价格	national	monthly	2025-11-27	3	6.83	4.74	8.91	LSTM	\N	2025-11-27 22:36:59.564648	2025-11-27 22:36:59.564648
175	菜椒	蔬菜价格	national	monthly	2025-11-27	1	9.68	7.86	11.49	ARIMA	65.89	2025-11-27 22:36:59.571925	2025-11-27 22:36:59.571925
176	菜椒	蔬菜价格	national	monthly	2025-11-27	2	10.16	7.11	13.20	ARIMA	65.89	2025-11-27 22:36:59.578779	2025-11-27 22:36:59.578779
177	菜椒	蔬菜价格	national	monthly	2025-11-27	3	10.63	6.31	14.96	ARIMA	65.89	2025-11-27 22:36:59.58559	2025-11-27 22:36:59.58559
178	菜椒	蔬菜价格	national	monthly	2025-11-27	1	8.02	5.97	10.07	LSTM	\N	2025-11-27 22:36:59.591895	2025-11-27 22:36:59.591895
179	菜椒	蔬菜价格	national	monthly	2025-11-27	2	8.20	6.15	10.25	LSTM	\N	2025-11-27 22:36:59.600029	2025-11-27 22:36:59.600029
180	菜椒	蔬菜价格	national	monthly	2025-11-27	3	8.13	6.08	10.18	LSTM	\N	2025-11-27 22:36:59.629519	2025-11-27 22:36:59.629519
181	四季豆	蔬菜价格	national	monthly	2025-11-27	1	12.92	12.30	13.53	ARIMA	68.39	2025-11-27 22:36:59.65225	2025-11-27 22:36:59.65225
182	四季豆	蔬菜价格	national	monthly	2025-11-27	2	13.22	12.56	13.88	ARIMA	68.39	2025-11-27 22:36:59.662973	2025-11-27 22:36:59.662973
183	四季豆	蔬菜价格	national	monthly	2025-11-27	3	12.95	12.28	13.61	ARIMA	68.39	2025-11-27 22:36:59.675107	2025-11-27 22:36:59.675107
184	四季豆	蔬菜价格	national	monthly	2025-11-27	1	11.79	9.38	14.21	LSTM	\N	2025-11-27 22:36:59.682481	2025-11-27 22:36:59.682481
185	四季豆	蔬菜价格	national	monthly	2025-11-27	2	11.75	9.34	14.17	LSTM	\N	2025-11-27 22:36:59.689161	2025-11-27 22:36:59.689161
186	四季豆	蔬菜价格	national	monthly	2025-11-27	3	11.57	9.15	13.98	LSTM	\N	2025-11-27 22:36:59.695485	2025-11-27 22:36:59.695485
\.


--
-- Data for Name: sys_cert_type; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.sys_cert_type (cert_type_id, cert_type_code, cert_type_name, apply_user_type, cert_level, required_materials, optional_materials, audit_cycle, audit_user_role, cert_status_effect, cert_type_status, sort, create_user, create_time, update_time) FROM stdin;
\.


--
-- Data for Name: sys_user; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.sys_user (user_id, user_name, password, real_name, user_type, id_card, phone, email, avatar, user_status, cert_status, create_time, update_time, last_login_time) FROM stdin;
1	nonghu_zhang3	$2b$10$5JKiMw/4aB3R/EivguyqROEew17i7vPjye6W4SBByqw5RfzW0RAmK	张三	1	920197fbfdc2416eac855e9a0f4be91b:4b0de5b2c4f127990540fcbe85bdec1e6d5f3a6c98ed86fdb7e7077b5b146e6f	13800138000	zhang3@example.com	\N	2	0	2025-10-27 00:43:06.450388	2025-10-27 00:43:06.450388	\N
2	buyer_li4	$2b$10$QpgQ6pzDugNckBYoXa9qQOMUtbmCKc/te4sLQQrR0/lNLuj3URCsm	李四	2	efb2d63a7c519490bf53b1baa172347e:214922266173ea2713019940acf93c80530d1a9e80e8e43ca2efdbf4c909b95b	13900139000	li4@example.com	\N	2	0	2025-10-27 00:43:06.597039	2025-10-27 00:43:06.597039	\N
4	nonghuzhang3	$2b$10$/n4HZiERkRDay1Is8lknUeF8SZaXtk2REqRNs28MBDpFtbs7lAaCq	张三	1	410101199001011234	13800138001	zhan3@example.com	\N	2	0	2025-10-30 17:55:35.571505	2025-10-30 17:55:35.571505	\N
26	farmer_li	$2b$10$kbT5lBfYK8KDa1kRWQoIsuw4bZk7eIXifl.UHoOCrQuCEJ/lukZ8.	李农户	1	ENC_370101199001011114	13800002222	\N	\N	1	1	2025-11-27 18:34:12.964992	2025-11-27 18:34:12.964992	\N
27	farmer_wang	$2b$10$kbT5lBfYK8KDa1kRWQoIsuw4bZk7eIXifl.UHoOCrQuCEJ/lukZ8.	王农户	1	ENC_230101199001011115	13800003333	\N	\N	1	1	2025-11-27 18:34:12.964992	2025-11-27 18:34:12.964992	\N
51	farmer001	$2b$10$test	张三	1	ENC_001	13900000001	f001@test.com	\N	1	1	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486	\N
7	testuser002	$2b$10$b1a7PdMp7oRg7JjWOGO0GuMGMAFh0/p8VGhOlpO9SQZjekd03gHLm	测试用户	2	410101199001011236	13800138005	new_email@example.com	\N	2	0	2025-10-31 14:33:43.123269	2025-10-31 14:45:29.564755	2025-10-31 14:39:41.224644
8	testuser003	$2b$10$4Yz6PGshxf3Bgs4StO./CuQ8igEsm5K5tqmQXs7sFY93HCOZP0WnG	测试用户	1	410101199001011237	13800138006	test3@example.com	\N	2	0	2025-10-31 14:50:50.874722	2025-10-31 14:51:14.461289	2025-10-31 14:51:14.461289
11	admin	$2b$10$eFkgkSp6FJl3Fgt7ELQ1huZWmWnnhe3ZuPHFZPDy9BLIwa0YYnuKi	系统管理员	3	110101199001011234	23800138000	\N	\N	1	0	2025-10-31 15:11:39.124452	2025-10-31 15:11:58.193551	2025-10-31 15:11:58.193551
5	testuser001	$2b$10$6lOzBwc4C08DqqEr5w4iHu2XPWn4xl8FT3.ytoCAKZCKT52iVSC5q	测试用户	1	410101199001011235	13800138003	test@example.com	\N	2	0	2025-10-30 17:57:41.2305	2025-11-01 11:15:53.628695	2025-11-01 11:15:53.628695
14	testuser2025	123456	测试专用账号2025	2	110101199003071888	13988888888	test2025@example.com	\N	1	1	2025-11-20 09:52:15.695421	2025-11-20 09:52:15.695421	\N
52	farmer002	$2b$10$test	李四	1	ENC_002	13900000002	f002@test.com	\N	1	1	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486	\N
25	farmer_zhang	$2b$10$kbT5lBfYK8KDa1kRWQoIsuw4bZk7eIXifl.UHoOCrQuCEJ/lukZ8.	张农户	1	ENC_410101199001011113	13800001111	\N	\N	1	1	2025-11-27 18:34:12.964992	2025-11-27 20:49:37.023122	2025-11-27 20:49:37.023122
16	testUser010	$2b$10$Xf0VoTVm8PdyIVPl/p7Szu/VZX90oppmw8UMflfzMECKmoIjq1DWu	测试用户	1	410101199001011100	13800138100	test@example10.com	\N	2	0	2025-11-27 14:45:56.900373	2025-11-27 14:58:46.1931	2025-11-27 14:58:46.1931
23	buyer_test	$2b$10$kbT5lBfYK8KDa1kRWQoIsuw4bZk7eIXifl.UHoOCrQuCEJ/lukZ8.	测试采购商	2	ENC_110101199001011111	13900001111	\N	\N	1	1	2025-11-27 18:34:12.964992	2025-11-27 20:50:00.843911	2025-11-27 20:50:00.843911
17	testUser011	$2b$10$euv9N0tqCfml18GOmrQ4t.7R1Zg1hzPf.TkbM.5z5IJo1VcPtUhvG	测试用户	2	410101199001011101	13800138101	test@example11.com	\N	2	0	2025-11-27 14:48:09.588148	2025-11-27 15:44:52.787966	2025-11-27 15:44:52.787966
24	buyer_zhang	$2b$10$kbT5lBfYK8KDa1kRWQoIsuw4bZk7eIXifl.UHoOCrQuCEJ/lukZ8.	张采购	2	ENC_110101199001011112	13900002222	\N	\N	1	1	2025-11-27 18:34:12.964992	2025-11-27 18:34:12.964992	\N
53	farmer003	$2b$10$test	王五	1	ENC_003	13900000003	f003@test.com	\N	1	1	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486	\N
54	farmer004	$2b$10$test	赵六	1	ENC_004	13900000004	f004@test.com	\N	1	1	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486	\N
55	farmer005	$2b$10$test	孙七	1	ENC_005	13900000005	f005@test.com	\N	1	1	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486	\N
56	buyer001	$2b$10$test	刘明	2	ENC_B001	13800000101	b001@test.com	\N	1	1	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486	\N
57	buyer002	$2b$10$test	陈华	2	ENC_B002	13800000102	b002@test.com	\N	1	1	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486	\N
58	buyer003	$2b$10$test	杨丽	2	ENC_B003	13800000103	b003@test.com	\N	1	1	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486	\N
59	buyer004	$2b$10$test	黄强	2	ENC_B004	13800000104	b004@test.com	\N	1	1	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486	\N
60	buyer005	$2b$10$test	林芳	2	ENC_B005	13800000105	b005@test.com	\N	1	1	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486	\N
61	seller2	$2b$10$YB6dHIQoJM1ArhN/Sy4m5uzQGLILuqch2x.Fp7jVVGptHKbeBTqIu	????2	1	410101199001019999	13812345679	seller2@example.com	\N	1	0	2025-11-28 05:54:13.763647	2025-11-28 05:55:53.207701	2025-11-28 05:55:53.207701
\.


--
-- Data for Name: sys_user_address; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.sys_user_address (address_id, user_id, address_name, receiver, phone, province, city, county, detail_address, is_default, postal_code, create_time, update_time) FROM stdin;
1	17	测试地址	测试收货人	13700137101	河南省	郑州市	金水区	测试街道测试号	1	450000	2025-11-27 15:46:30.90798	2025-11-27 15:46:30.90798
4	23	公司地址	张三	13800138000	北京市	朝阳区	建国路街道	建国路88号SOHO现代城A座1001室	1	\N	2025-11-27 18:34:12.964992	2025-11-27 18:34:12.964992
5	23	家庭地址	李四	13900139000	上海市	浦东新区	陆家嘴街道	陆家嘴金融中心B座2001室	0	\N	2025-11-27 18:34:12.964992	2025-11-27 18:34:12.964992
44	1	默认地址	张三	13800138000	北京市	北京市	朝阳区	农业路1号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
45	2	默认地址	李四	13900139000	北京市	北京市	朝阳区	农业路2号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
46	4	默认地址	张三	13800138001	北京市	北京市	朝阳区	农业路4号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
47	26	默认地址	李农户	13800002222	北京市	北京市	朝阳区	农业路26号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
48	27	默认地址	王农户	13800003333	北京市	北京市	朝阳区	农业路27号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
49	51	默认地址	张三	13900000001	北京市	北京市	朝阳区	农业路51号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
50	7	默认地址	测试用户	13800138005	北京市	北京市	朝阳区	农业路7号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
51	8	默认地址	测试用户	13800138006	北京市	北京市	朝阳区	农业路8号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
52	5	默认地址	测试用户	13800138003	北京市	北京市	朝阳区	农业路5号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
53	14	默认地址	测试专用账号2025	13988888888	北京市	北京市	朝阳区	农业路14号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
54	52	默认地址	李四	13900000002	北京市	北京市	朝阳区	农业路52号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
55	25	默认地址	张农户	13800001111	北京市	北京市	朝阳区	农业路25号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
56	16	默认地址	测试用户	13800138100	北京市	北京市	朝阳区	农业路16号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
57	23	默认地址	测试采购商	13900001111	北京市	北京市	朝阳区	农业路23号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
58	17	默认地址	测试用户	13800138101	北京市	北京市	朝阳区	农业路17号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
59	24	默认地址	张采购	13900002222	北京市	北京市	朝阳区	农业路24号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
60	53	默认地址	王五	13900000003	北京市	北京市	朝阳区	农业路53号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
61	54	默认地址	赵六	13900000004	北京市	北京市	朝阳区	农业路54号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
62	55	默认地址	孙七	13900000005	北京市	北京市	朝阳区	农业路55号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
63	56	默认地址	刘明	13800000101	北京市	北京市	朝阳区	农业路56号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
64	57	默认地址	陈华	13800000102	北京市	北京市	朝阳区	农业路57号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
65	58	默认地址	杨丽	13800000103	北京市	北京市	朝阳区	农业路58号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
66	59	默认地址	黄强	13800000104	北京市	北京市	朝阳区	农业路59号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
67	60	默认地址	林芳	13800000105	北京市	北京市	朝阳区	农业路60号	1	100000	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
\.


--
-- Data for Name: sys_user_buyer; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.sys_user_buyer (buyer_id, user_id, buyer_type, company_name, company_address, taxpayer_id, purchase_scope, monthly_purchase, default_address_id, preferred_payment, preferred_logistics, create_time, update_time) FROM stdin;
17	2	1	公司2	地址2	TAX2	农产品	50000.00	\N	1	顺丰	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
18	7	1	公司7	地址7	TAX7	农产品	50000.00	\N	1	顺丰	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
19	14	1	公司14	地址14	TAX14	农产品	50000.00	\N	1	顺丰	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
20	23	1	公司23	地址23	TAX23	农产品	50000.00	\N	1	顺丰	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
21	17	1	公司17	地址17	TAX17	农产品	50000.00	\N	1	顺丰	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
22	24	1	公司24	地址24	TAX24	农产品	50000.00	\N	1	顺丰	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
23	56	1	公司56	地址56	TAX56	农产品	50000.00	\N	1	顺丰	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
24	57	1	公司57	地址57	TAX57	农产品	50000.00	\N	1	顺丰	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
25	58	1	公司58	地址58	TAX58	农产品	50000.00	\N	1	顺丰	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
26	59	1	公司59	地址59	TAX59	农产品	50000.00	\N	1	顺丰	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
27	60	1	公司60	地址60	TAX60	农产品	50000.00	\N	1	顺丰	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
\.


--
-- Data for Name: sys_user_cert_apply; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.sys_user_cert_apply (apply_id, apply_no, user_id, cert_type_id, cert_type_code, apply_info, apply_status, apply_time, audit_user_id, audit_time, audit_remark, reject_reason_type, reapply_count, last_reapply_time, cert_effect_time, cert_expire_time, cancel_time, cancel_reason, create_time, update_time) FROM stdin;
\.


--
-- Data for Name: sys_user_cert_material; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.sys_user_cert_material (material_id, apply_id, material_type, material_name, material_url, material_format, material_size, material_status, upload_time, replace_material_id, upload_user_id) FROM stdin;
\.


--
-- Data for Name: sys_user_farmer; Type: TABLE DATA; Schema: public; Owner: agri_root
--

COPY public.sys_user_farmer (farmer_id, user_id, farm_name, contact_person, contact_phone, bank_card_no, bank_name, qualification, create_time, update_time) FROM stdin;
4	1	张三的农场	张三	13800138000	\N	\N	专注优质农产品种植，坚持绿色无公害种植理念。	2025-11-27 21:04:50.894149	2025-11-27 21:04:50.894149
5	4	张三的农场	张三	13800138000	\N	\N	专注优质农产品种植，坚持绿色无公害种植理念。	2025-11-27 21:04:50.915509	2025-11-27 21:04:50.915509
1	5	测试用户的农场	测试用户	13800138000	6228480388888888888	中国农业银行测试支行	专注优质农产品种植，坚持绿色无公害种植理念。	2025-11-01 11:17:18.51849	2025-11-27 21:04:50.935375
6	8	测试用户的农场	测试用户	13800138000	\N	\N	专注优质农产品种植，坚持绿色无公害种植理念。	2025-11-27 21:04:50.959334	2025-11-27 21:04:50.959334
3	16	测试用户的农场	测试用户	13800138000	6228480388888888810	中国农业银行测试支行	专注优质农产品种植，坚持绿色无公害种植理念。	2025-11-27 15:00:21.337881	2025-11-27 21:04:50.980198
27	26	\N	李农户	13800002222	BANK_26	农业银行	有机认证	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
28	27	\N	王农户	13800003333	BANK_27	农业银行	有机认证	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
29	51	绿野农场	张三	13900000001	BANK_51	农业银行	有机认证	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
32	52	丰收农场	李四	13900000002	BANK_52	农业银行	有机认证	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
33	25	\N	张农户	13800001111	BANK_25	农业银行	有机认证	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
35	53	金穗合作社	王五	13900000003	BANK_53	农业银行	有机认证	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
36	54	春耕基地	赵六	13900000004	BANK_54	农业银行	有机认证	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
37	55	阳光果蔬园	孙七	13900000005	BANK_55	农业银行	有机认证	2025-11-28 03:55:35.070486	2025-11-28 03:55:35.070486
\.


--
-- Name: community_blacklist_black_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.community_blacklist_black_id_seq', 1, false);


--
-- Name: community_categories_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.community_categories_category_id_seq', 301, true);


--
-- Name: community_collects_collect_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.community_collects_collect_id_seq', 12, true);


--
-- Name: community_comments_comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.community_comments_comment_id_seq', 35, true);


--
-- Name: community_content_content_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.community_content_content_id_seq', 25, true);


--
-- Name: community_content_tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.community_content_tags_id_seq', 28, true);


--
-- Name: community_follows_follow_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.community_follows_follow_id_seq', 11, true);


--
-- Name: community_likes_like_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.community_likes_like_id_seq', 18, true);


--
-- Name: community_qa_relation_qa_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.community_qa_relation_qa_id_seq', 1, true);


--
-- Name: community_reports_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.community_reports_report_id_seq', 1, false);


--
-- Name: community_tags_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.community_tags_tag_id_seq', 15, true);


--
-- Name: community_violations_violation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.community_violations_violation_id_seq', 1, false);


--
-- Name: financing_application_application_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.financing_application_application_id_seq', 90, true);


--
-- Name: financing_bank_approval_approval_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.financing_bank_approval_approval_id_seq', 14, true);


--
-- Name: financing_bank_bank_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.financing_bank_bank_id_seq', 45, true);


--
-- Name: financing_credit_evaluation_evaluation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.financing_credit_evaluation_evaluation_id_seq', 51, true);


--
-- Name: financing_loan_type_loan_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.financing_loan_type_loan_type_id_seq', 48, true);


--
-- Name: financing_presale_plan_plan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.financing_presale_plan_plan_id_seq', 15, true);


--
-- Name: financing_presale_subscription_subscription_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.financing_presale_subscription_subscription_id_seq', 24, true);


--
-- Name: financing_repayment_adjustment_request_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.financing_repayment_adjustment_request_request_id_seq', 4, true);


--
-- Name: financing_repayment_schedule_schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.financing_repayment_schedule_schedule_id_seq', 27, true);


--
-- Name: forecast_job_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.forecast_job_logs_id_seq', 1, true);


--
-- Name: historical_prices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.historical_prices_id_seq', 195, true);


--
-- Name: mall_buyer_demand_demand_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_buyer_demand_demand_id_seq', 30, true);


--
-- Name: mall_coupon_rule_rule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_coupon_rule_rule_id_seq', 14, true);


--
-- Name: mall_discount_activity_activity_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_discount_activity_activity_id_seq', 87, true);


--
-- Name: mall_farmer_source_source_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_farmer_source_source_id_seq', 105, true);


--
-- Name: mall_operation_log_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_operation_log_log_id_seq', 50, true);


--
-- Name: mall_order_aftersale_aftersale_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_order_aftersale_aftersale_id_seq', 51, true);


--
-- Name: mall_order_invoice_invoice_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_order_invoice_invoice_id_seq', 1, false);


--
-- Name: mall_order_item_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_order_item_item_id_seq', 39, true);


--
-- Name: mall_product_category_category_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_product_category_category_id_seq', 1, true);


--
-- Name: mall_product_price_stat_stat_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_product_price_stat_stat_id_seq', 50, true);


--
-- Name: mall_shopping_cart_cart_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_shopping_cart_cart_id_seq', 16, true);


--
-- Name: mall_supply_demand_match_match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_supply_demand_match_match_id_seq', 85, true);


--
-- Name: mall_user_collection_collection_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_user_collection_collection_id_seq', 15, true);


--
-- Name: mall_user_coupon_user_coupon_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_user_coupon_user_coupon_id_seq', 16, true);


--
-- Name: mall_user_follow_follow_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_user_follow_follow_id_seq', 6, true);


--
-- Name: mall_user_footprint_footprint_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.mall_user_footprint_footprint_id_seq', 25, true);


--
-- Name: prediction_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.prediction_logs_id_seq', 1, true);


--
-- Name: price_forecasts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.price_forecasts_id_seq', 45, true);


--
-- Name: price_predictions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.price_predictions_id_seq', 186, true);


--
-- Name: sys_cert_type_cert_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.sys_cert_type_cert_type_id_seq', 45, true);


--
-- Name: sys_user_address_address_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.sys_user_address_address_id_seq', 67, true);


--
-- Name: sys_user_buyer_buyer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.sys_user_buyer_buyer_id_seq', 27, true);


--
-- Name: sys_user_cert_apply_apply_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.sys_user_cert_apply_apply_id_seq', 48, true);


--
-- Name: sys_user_cert_material_material_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.sys_user_cert_material_material_id_seq', 40, true);


--
-- Name: sys_user_farmer_farmer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.sys_user_farmer_farmer_id_seq', 37, true);


--
-- Name: sys_user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: agri_root
--

SELECT pg_catalog.setval('public.sys_user_user_id_seq', 61, true);


--
-- Name: community_blacklist community_blacklist_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_blacklist
    ADD CONSTRAINT community_blacklist_pkey PRIMARY KEY (black_id);


--
-- Name: community_categories community_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_categories
    ADD CONSTRAINT community_categories_pkey PRIMARY KEY (category_id);


--
-- Name: community_collects community_collects_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_collects
    ADD CONSTRAINT community_collects_pkey PRIMARY KEY (collect_id);


--
-- Name: community_comments community_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_comments
    ADD CONSTRAINT community_comments_pkey PRIMARY KEY (comment_id);


--
-- Name: community_content community_content_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_content
    ADD CONSTRAINT community_content_pkey PRIMARY KEY (content_id);


--
-- Name: community_content_tags community_content_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_content_tags
    ADD CONSTRAINT community_content_tags_pkey PRIMARY KEY (id);


--
-- Name: community_follows community_follows_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_follows
    ADD CONSTRAINT community_follows_pkey PRIMARY KEY (follow_id);


--
-- Name: community_likes community_likes_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_likes
    ADD CONSTRAINT community_likes_pkey PRIMARY KEY (like_id);


--
-- Name: community_qa_relation community_qa_relation_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_qa_relation
    ADD CONSTRAINT community_qa_relation_pkey PRIMARY KEY (qa_id);


--
-- Name: community_reports community_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_reports
    ADD CONSTRAINT community_reports_pkey PRIMARY KEY (report_id);


--
-- Name: community_tags community_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_tags
    ADD CONSTRAINT community_tags_pkey PRIMARY KEY (tag_id);


--
-- Name: community_violations community_violations_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_violations
    ADD CONSTRAINT community_violations_pkey PRIMARY KEY (violation_id);


--
-- Name: financing_application financing_application_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_application
    ADD CONSTRAINT financing_application_pkey PRIMARY KEY (application_id);


--
-- Name: financing_bank_approval financing_bank_approval_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_bank_approval
    ADD CONSTRAINT financing_bank_approval_pkey PRIMARY KEY (approval_id);


--
-- Name: financing_bank financing_bank_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_bank
    ADD CONSTRAINT financing_bank_pkey PRIMARY KEY (bank_id);


--
-- Name: financing_credit_evaluation financing_credit_evaluation_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_credit_evaluation
    ADD CONSTRAINT financing_credit_evaluation_pkey PRIMARY KEY (evaluation_id);


--
-- Name: financing_loan_type financing_loan_type_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_loan_type
    ADD CONSTRAINT financing_loan_type_pkey PRIMARY KEY (loan_type_id);


--
-- Name: financing_presale_plan financing_presale_plan_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_presale_plan
    ADD CONSTRAINT financing_presale_plan_pkey PRIMARY KEY (plan_id);


--
-- Name: financing_presale_plan financing_presale_plan_plan_no_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_presale_plan
    ADD CONSTRAINT financing_presale_plan_plan_no_key UNIQUE (plan_no);


--
-- Name: financing_presale_subscription financing_presale_subscription_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_presale_subscription
    ADD CONSTRAINT financing_presale_subscription_pkey PRIMARY KEY (subscription_id);


--
-- Name: financing_presale_subscription financing_presale_subscription_subscription_no_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_presale_subscription
    ADD CONSTRAINT financing_presale_subscription_subscription_no_key UNIQUE (subscription_no);


--
-- Name: financing_repayment_adjustment_request financing_repayment_adjustment_request_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_repayment_adjustment_request
    ADD CONSTRAINT financing_repayment_adjustment_request_pkey PRIMARY KEY (request_id);


--
-- Name: financing_repayment_schedule financing_repayment_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_repayment_schedule
    ADD CONSTRAINT financing_repayment_schedule_pkey PRIMARY KEY (schedule_id);


--
-- Name: forecast_job_logs forecast_job_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.forecast_job_logs
    ADD CONSTRAINT forecast_job_logs_pkey PRIMARY KEY (id);


--
-- Name: historical_prices historical_prices_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.historical_prices
    ADD CONSTRAINT historical_prices_pkey PRIMARY KEY (id);


--
-- Name: mall_buyer_demand mall_buyer_demand_demand_no_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_buyer_demand
    ADD CONSTRAINT mall_buyer_demand_demand_no_key UNIQUE (demand_no);


--
-- Name: mall_buyer_demand mall_buyer_demand_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_buyer_demand
    ADD CONSTRAINT mall_buyer_demand_pkey PRIMARY KEY (demand_id);


--
-- Name: mall_coupon_rule mall_coupon_rule_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_coupon_rule
    ADD CONSTRAINT mall_coupon_rule_pkey PRIMARY KEY (rule_id);


--
-- Name: mall_discount_activity mall_discount_activity_activity_no_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_discount_activity
    ADD CONSTRAINT mall_discount_activity_activity_no_key UNIQUE (activity_no);


--
-- Name: mall_discount_activity mall_discount_activity_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_discount_activity
    ADD CONSTRAINT mall_discount_activity_pkey PRIMARY KEY (activity_id);


--
-- Name: mall_farmer_source mall_farmer_source_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_farmer_source
    ADD CONSTRAINT mall_farmer_source_pkey PRIMARY KEY (source_id);


--
-- Name: mall_farmer_source mall_farmer_source_source_no_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_farmer_source
    ADD CONSTRAINT mall_farmer_source_source_no_key UNIQUE (source_no);


--
-- Name: mall_operation_log mall_operation_log_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_operation_log
    ADD CONSTRAINT mall_operation_log_pkey PRIMARY KEY (log_id);


--
-- Name: mall_order_aftersale mall_order_aftersale_order_id_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_aftersale
    ADD CONSTRAINT mall_order_aftersale_order_id_key UNIQUE (order_id);


--
-- Name: mall_order_aftersale mall_order_aftersale_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_aftersale
    ADD CONSTRAINT mall_order_aftersale_pkey PRIMARY KEY (aftersale_id);


--
-- Name: mall_order_invoice mall_order_invoice_invoice_no_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_invoice
    ADD CONSTRAINT mall_order_invoice_invoice_no_key UNIQUE (invoice_no);


--
-- Name: mall_order_invoice mall_order_invoice_order_id_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_invoice
    ADD CONSTRAINT mall_order_invoice_order_id_key UNIQUE (order_id);


--
-- Name: mall_order_invoice mall_order_invoice_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_invoice
    ADD CONSTRAINT mall_order_invoice_pkey PRIMARY KEY (invoice_id);


--
-- Name: mall_order_item mall_order_item_item_no_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_item
    ADD CONSTRAINT mall_order_item_item_no_key UNIQUE (item_no);


--
-- Name: mall_order_item mall_order_item_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_item
    ADD CONSTRAINT mall_order_item_pkey PRIMARY KEY (item_id);


--
-- Name: mall_order_main mall_order_main_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_main
    ADD CONSTRAINT mall_order_main_pkey PRIMARY KEY (order_id);


--
-- Name: mall_product_category mall_product_category_category_code_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_product_category
    ADD CONSTRAINT mall_product_category_category_code_key UNIQUE (category_code);


--
-- Name: mall_product_category mall_product_category_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_product_category
    ADD CONSTRAINT mall_product_category_pkey PRIMARY KEY (category_id);


--
-- Name: mall_product_price_stat mall_product_price_stat_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_product_price_stat
    ADD CONSTRAINT mall_product_price_stat_pkey PRIMARY KEY (stat_id);


--
-- Name: mall_shopping_cart mall_shopping_cart_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_shopping_cart
    ADD CONSTRAINT mall_shopping_cart_pkey PRIMARY KEY (cart_id);


--
-- Name: mall_supply_demand_match mall_supply_demand_match_match_no_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_supply_demand_match
    ADD CONSTRAINT mall_supply_demand_match_match_no_key UNIQUE (match_no);


--
-- Name: mall_supply_demand_match mall_supply_demand_match_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_supply_demand_match
    ADD CONSTRAINT mall_supply_demand_match_pkey PRIMARY KEY (match_id);


--
-- Name: mall_user_collection mall_user_collection_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_collection
    ADD CONSTRAINT mall_user_collection_pkey PRIMARY KEY (collection_id);


--
-- Name: mall_user_coupon mall_user_coupon_coupon_no_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_coupon
    ADD CONSTRAINT mall_user_coupon_coupon_no_key UNIQUE (coupon_no);


--
-- Name: mall_user_coupon mall_user_coupon_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_coupon
    ADD CONSTRAINT mall_user_coupon_pkey PRIMARY KEY (user_coupon_id);


--
-- Name: mall_user_follow mall_user_follow_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_follow
    ADD CONSTRAINT mall_user_follow_pkey PRIMARY KEY (follow_id);


--
-- Name: mall_user_footprint mall_user_footprint_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_footprint
    ADD CONSTRAINT mall_user_footprint_pkey PRIMARY KEY (footprint_id);


--
-- Name: prediction_logs prediction_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.prediction_logs
    ADD CONSTRAINT prediction_logs_pkey PRIMARY KEY (id);


--
-- Name: price_forecasts price_forecasts_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.price_forecasts
    ADD CONSTRAINT price_forecasts_pkey PRIMARY KEY (id);


--
-- Name: price_predictions price_predictions_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.price_predictions
    ADD CONSTRAINT price_predictions_pkey PRIMARY KEY (id);


--
-- Name: price_predictions price_predictions_product_name_region_prediction_type_predi_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.price_predictions
    ADD CONSTRAINT price_predictions_product_name_region_prediction_type_predi_key UNIQUE (product_name, region, prediction_type, prediction_date, period_number, model_type);


--
-- Name: sys_cert_type sys_cert_type_cert_type_code_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_cert_type
    ADD CONSTRAINT sys_cert_type_cert_type_code_key UNIQUE (cert_type_code);


--
-- Name: sys_cert_type sys_cert_type_cert_type_name_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_cert_type
    ADD CONSTRAINT sys_cert_type_cert_type_name_key UNIQUE (cert_type_name);


--
-- Name: sys_cert_type sys_cert_type_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_cert_type
    ADD CONSTRAINT sys_cert_type_pkey PRIMARY KEY (cert_type_id);


--
-- Name: sys_user_address sys_user_address_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_address
    ADD CONSTRAINT sys_user_address_pkey PRIMARY KEY (address_id);


--
-- Name: sys_user_buyer sys_user_buyer_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_buyer
    ADD CONSTRAINT sys_user_buyer_pkey PRIMARY KEY (buyer_id);


--
-- Name: sys_user_buyer sys_user_buyer_taxpayer_id_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_buyer
    ADD CONSTRAINT sys_user_buyer_taxpayer_id_key UNIQUE (taxpayer_id);


--
-- Name: sys_user_buyer sys_user_buyer_user_id_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_buyer
    ADD CONSTRAINT sys_user_buyer_user_id_key UNIQUE (user_id);


--
-- Name: sys_user_cert_apply sys_user_cert_apply_apply_no_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_cert_apply
    ADD CONSTRAINT sys_user_cert_apply_apply_no_key UNIQUE (apply_no);


--
-- Name: sys_user_cert_apply sys_user_cert_apply_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_cert_apply
    ADD CONSTRAINT sys_user_cert_apply_pkey PRIMARY KEY (apply_id);


--
-- Name: sys_user_cert_material sys_user_cert_material_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_cert_material
    ADD CONSTRAINT sys_user_cert_material_pkey PRIMARY KEY (material_id);


--
-- Name: sys_user sys_user_email_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user
    ADD CONSTRAINT sys_user_email_key UNIQUE (email);


--
-- Name: sys_user_farmer sys_user_farmer_bank_card_no_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_farmer
    ADD CONSTRAINT sys_user_farmer_bank_card_no_key UNIQUE (bank_card_no);


--
-- Name: sys_user_farmer sys_user_farmer_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_farmer
    ADD CONSTRAINT sys_user_farmer_pkey PRIMARY KEY (farmer_id);


--
-- Name: sys_user_farmer sys_user_farmer_user_id_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_farmer
    ADD CONSTRAINT sys_user_farmer_user_id_key UNIQUE (user_id);


--
-- Name: sys_user sys_user_id_card_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user
    ADD CONSTRAINT sys_user_id_card_key UNIQUE (id_card);


--
-- Name: sys_user sys_user_phone_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user
    ADD CONSTRAINT sys_user_phone_key UNIQUE (phone);


--
-- Name: sys_user sys_user_pkey; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user
    ADD CONSTRAINT sys_user_pkey PRIMARY KEY (user_id);


--
-- Name: sys_user sys_user_user_name_key; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user
    ADD CONSTRAINT sys_user_user_name_key UNIQUE (user_name);


--
-- Name: financing_application uk_30md8gcu4qvuekxi4sv80fj9b; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_application
    ADD CONSTRAINT uk_30md8gcu4qvuekxi4sv80fj9b UNIQUE (application_no);


--
-- Name: financing_bank uk_3gs7k2ppjkvjvmg3q16r587ku; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_bank
    ADD CONSTRAINT uk_3gs7k2ppjkvjvmg3q16r587ku UNIQUE (bank_short_name);


--
-- Name: sys_user_cert_material uk_apply_material; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_cert_material
    ADD CONSTRAINT uk_apply_material UNIQUE (apply_id, material_type);


--
-- Name: community_blacklist uk_blocker_blacked; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_blacklist
    ADD CONSTRAINT uk_blocker_blacked UNIQUE (blocker_id, blacked_user_id);


--
-- Name: community_collects uk_collects_content_user; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_collects
    ADD CONSTRAINT uk_collects_content_user UNIQUE (content_id, user_id);


--
-- Name: community_content_tags uk_content_tag; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_content_tags
    ADD CONSTRAINT uk_content_tag UNIQUE (content_id, tag_id);


--
-- Name: financing_loan_type uk_f6m7mlo513jx72y4uvrs0uw8y; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_loan_type
    ADD CONSTRAINT uk_f6m7mlo513jx72y4uvrs0uw8y UNIQUE (loan_type_name);


--
-- Name: community_follows uk_follower_followed; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_follows
    ADD CONSTRAINT uk_follower_followed UNIQUE (follower_id, followed_id);


--
-- Name: financing_bank_approval uk_gfa4h9lnwckn5egp2pgr96ftk; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_bank_approval
    ADD CONSTRAINT uk_gfa4h9lnwckn5egp2pgr96ftk UNIQUE (application_id);


--
-- Name: community_likes uk_likes_content_user; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_likes
    ADD CONSTRAINT uk_likes_content_user UNIQUE (content_id, user_id);


--
-- Name: financing_bank uk_lt95tuqqedce59kv9d29rsky2; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_bank
    ADD CONSTRAINT uk_lt95tuqqedce59kv9d29rsky2 UNIQUE (bank_name);


--
-- Name: community_qa_relation uk_qa_content; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_qa_relation
    ADD CONSTRAINT uk_qa_content UNIQUE (content_id);


--
-- Name: community_reports uk_report_no; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_reports
    ADD CONSTRAINT uk_report_no UNIQUE (report_no);


--
-- Name: financing_credit_evaluation uk_rve9ust259lf4omndr4nu6mob; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_credit_evaluation
    ADD CONSTRAINT uk_rve9ust259lf4omndr4nu6mob UNIQUE (application_id);


--
-- Name: community_tags uk_tag_name; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.community_tags
    ADD CONSTRAINT uk_tag_name UNIQUE (tag_name);


--
-- Name: mall_shopping_cart unique_user_source; Type: CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_shopping_cart
    ADD CONSTRAINT unique_user_source UNIQUE (user_id, source_id);


--
-- Name: idx_blacklist_blocker; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_blacklist_blocker ON public.community_blacklist USING btree (blocker_id);


--
-- Name: idx_cart_source_id; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_cart_source_id ON public.mall_shopping_cart USING btree (source_id);


--
-- Name: idx_cart_user_id; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_cart_user_id ON public.mall_shopping_cart USING btree (user_id);


--
-- Name: idx_categories_enabled; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_categories_enabled ON public.community_categories USING btree (is_enabled);


--
-- Name: idx_categories_parent; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_categories_parent ON public.community_categories USING btree (parent_id);


--
-- Name: idx_collects_user; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_collects_user ON public.community_collects USING btree (user_id);


--
-- Name: idx_comments_commenter; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_comments_commenter ON public.community_comments USING btree (commenter_id);


--
-- Name: idx_comments_content; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_comments_content ON public.community_comments USING btree (content_id);


--
-- Name: idx_comments_parent; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_comments_parent ON public.community_comments USING btree (parent_id);


--
-- Name: idx_content_audit; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_content_audit ON public.community_content USING btree (audit_status);


--
-- Name: idx_content_author; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_content_author ON public.community_content USING btree (author_id);


--
-- Name: idx_content_category; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_content_category ON public.community_content USING btree (category_id);


--
-- Name: idx_content_create_time; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_content_create_time ON public.community_content USING btree (create_time);


--
-- Name: idx_content_tags_tag; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_content_tags_tag ON public.community_content_tags USING btree (tag_id);


--
-- Name: idx_content_type; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_content_type ON public.community_content USING btree (content_type);


--
-- Name: idx_created_at; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_created_at ON public.price_predictions USING btree (created_at);


--
-- Name: idx_follows_followed; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_follows_followed ON public.community_follows USING btree (followed_id);


--
-- Name: idx_follows_follower; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_follows_follower ON public.community_follows USING btree (follower_id);


--
-- Name: idx_forecast_date; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_forecast_date ON public.price_forecasts USING btree (forecast_month);


--
-- Name: idx_forecast_prediction_date; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_forecast_prediction_date ON public.price_forecasts USING btree (prediction_date);


--
-- Name: idx_forecast_product; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_forecast_product ON public.price_forecasts USING btree (product_name);


--
-- Name: idx_forecast_region; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_forecast_region ON public.price_forecasts USING btree (region);


--
-- Name: idx_historical_date; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_historical_date ON public.historical_prices USING btree (price_date);


--
-- Name: idx_historical_product; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_historical_product ON public.historical_prices USING btree (product_name);


--
-- Name: idx_likes_user; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_likes_user ON public.community_likes USING btree (user_id);


--
-- Name: idx_prediction_date; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_prediction_date ON public.price_predictions USING btree (prediction_date);


--
-- Name: idx_presale_plan_status; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_presale_plan_status ON public.financing_presale_plan USING btree (plan_status);


--
-- Name: idx_presale_plan_user_id; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_presale_plan_user_id ON public.financing_presale_plan USING btree (user_id);


--
-- Name: idx_product_name; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_product_name ON public.price_predictions USING btree (product_name);


--
-- Name: idx_qa_status; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_qa_status ON public.community_qa_relation USING btree (qa_status);


--
-- Name: idx_region; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_region ON public.price_predictions USING btree (region);


--
-- Name: idx_reports_audit_status; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_reports_audit_status ON public.community_reports USING btree (audit_status);


--
-- Name: idx_reports_reporter; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_reports_reporter ON public.community_reports USING btree (reporter_id);


--
-- Name: idx_reports_type_obj; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_reports_type_obj ON public.community_reports USING btree (report_type, report_obj_id);


--
-- Name: idx_start_time; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_start_time ON public.prediction_logs USING btree (start_time);


--
-- Name: idx_status; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_status ON public.prediction_logs USING btree (status);


--
-- Name: idx_subscription_plan_id; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_subscription_plan_id ON public.financing_presale_subscription USING btree (plan_id);


--
-- Name: idx_subscription_user_id; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_subscription_user_id ON public.financing_presale_subscription USING btree (user_id);


--
-- Name: idx_tags_enabled; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_tags_enabled ON public.community_tags USING btree (is_enabled);


--
-- Name: idx_task_name; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_task_name ON public.prediction_logs USING btree (task_name);


--
-- Name: idx_violations_report; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_violations_report ON public.community_violations USING btree (report_id);


--
-- Name: idx_violations_violator; Type: INDEX; Schema: public; Owner: agri_root
--

CREATE INDEX idx_violations_violator ON public.community_violations USING btree (violator_id);


--
-- Name: community_categories update_categories_updated_at; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.community_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: community_content update_content_updated_at; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON public.community_content FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: mall_buyer_demand update_mall_buyer_demand_modtime; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_mall_buyer_demand_modtime BEFORE UPDATE ON public.mall_buyer_demand FOR EACH ROW EXECUTE FUNCTION public.update_timestamp_column();


--
-- Name: mall_coupon_rule update_mall_coupon_rule_modtime; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_mall_coupon_rule_modtime BEFORE UPDATE ON public.mall_coupon_rule FOR EACH ROW EXECUTE FUNCTION public.update_timestamp_column();


--
-- Name: mall_discount_activity update_mall_discount_activity_modtime; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_mall_discount_activity_modtime BEFORE UPDATE ON public.mall_discount_activity FOR EACH ROW EXECUTE FUNCTION public.update_timestamp_column();


--
-- Name: mall_farmer_source update_mall_farmer_source_modtime; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_mall_farmer_source_modtime BEFORE UPDATE ON public.mall_farmer_source FOR EACH ROW EXECUTE FUNCTION public.update_timestamp_column();


--
-- Name: mall_order_aftersale update_mall_order_aftersale_updated_at; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_mall_order_aftersale_updated_at BEFORE UPDATE ON public.mall_order_aftersale FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: mall_order_invoice update_mall_order_invoice_updated_at; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_mall_order_invoice_updated_at BEFORE UPDATE ON public.mall_order_invoice FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: mall_order_item update_mall_order_item_updated_at; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_mall_order_item_updated_at BEFORE UPDATE ON public.mall_order_item FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: mall_order_main update_mall_order_main_modtime; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_mall_order_main_modtime BEFORE UPDATE ON public.mall_order_main FOR EACH ROW EXECUTE FUNCTION public.update_timestamp_column();


--
-- Name: mall_product_category update_mall_product_category_modtime; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_mall_product_category_modtime BEFORE UPDATE ON public.mall_product_category FOR EACH ROW EXECUTE FUNCTION public.update_timestamp_column();


--
-- Name: mall_supply_demand_match update_mall_supply_demand_match_modtime; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_mall_supply_demand_match_modtime BEFORE UPDATE ON public.mall_supply_demand_match FOR EACH ROW EXECUTE FUNCTION public.update_timestamp_column();


--
-- Name: community_qa_relation update_qa_updated_at; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_qa_updated_at BEFORE UPDATE ON public.community_qa_relation FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: sys_cert_type update_sys_cert_type_updated_at; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_sys_cert_type_updated_at BEFORE UPDATE ON public.sys_cert_type FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: sys_user_address update_sys_user_address_modtime; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_sys_user_address_modtime BEFORE UPDATE ON public.sys_user_address FOR EACH ROW EXECUTE FUNCTION public.update_timestamp_column();


--
-- Name: sys_user_buyer update_sys_user_buyer_modtime; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_sys_user_buyer_modtime BEFORE UPDATE ON public.sys_user_buyer FOR EACH ROW EXECUTE FUNCTION public.update_timestamp_column();


--
-- Name: sys_user_cert_apply update_sys_user_cert_apply_updated_at; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_sys_user_cert_apply_updated_at BEFORE UPDATE ON public.sys_user_cert_apply FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: sys_user_farmer update_sys_user_farmer_modtime; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_sys_user_farmer_modtime BEFORE UPDATE ON public.sys_user_farmer FOR EACH ROW EXECUTE FUNCTION public.update_timestamp_column();


--
-- Name: sys_user update_sys_user_modtime; Type: TRIGGER; Schema: public; Owner: agri_root
--

CREATE TRIGGER update_sys_user_modtime BEFORE UPDATE ON public.sys_user FOR EACH ROW EXECUTE FUNCTION public.update_timestamp_column();


--
-- Name: sys_user_cert_material fk_apply; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_cert_material
    ADD CONSTRAINT fk_apply FOREIGN KEY (apply_id) REFERENCES public.sys_user_cert_apply(apply_id);


--
-- Name: mall_order_aftersale fk_apply_user; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_aftersale
    ADD CONSTRAINT fk_apply_user FOREIGN KEY (apply_user) REFERENCES public.sys_user(user_id);


--
-- Name: sys_user_cert_apply fk_audit_user; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_cert_apply
    ADD CONSTRAINT fk_audit_user FOREIGN KEY (audit_user_id) REFERENCES public.sys_user(user_id);


--
-- Name: mall_order_aftersale fk_audit_user; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_aftersale
    ADD CONSTRAINT fk_audit_user FOREIGN KEY (audit_user) REFERENCES public.sys_user(user_id);


--
-- Name: mall_order_invoice fk_buyer; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_invoice
    ADD CONSTRAINT fk_buyer FOREIGN KEY (buyer_id) REFERENCES public.sys_user(user_id);


--
-- Name: mall_shopping_cart fk_cart_source; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_shopping_cart
    ADD CONSTRAINT fk_cart_source FOREIGN KEY (source_id) REFERENCES public.mall_farmer_source(source_id) ON DELETE CASCADE;


--
-- Name: mall_shopping_cart fk_cart_user; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_shopping_cart
    ADD CONSTRAINT fk_cart_user FOREIGN KEY (user_id) REFERENCES public.sys_user(user_id) ON DELETE CASCADE;


--
-- Name: mall_product_price_stat fk_category; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_product_price_stat
    ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES public.mall_product_category(category_id);


--
-- Name: sys_user_cert_apply fk_cert_type; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_cert_apply
    ADD CONSTRAINT fk_cert_type FOREIGN KEY (cert_type_id) REFERENCES public.sys_cert_type(cert_type_id);


--
-- Name: sys_cert_type fk_create_user; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_cert_type
    ADD CONSTRAINT fk_create_user FOREIGN KEY (create_user) REFERENCES public.sys_user(user_id);


--
-- Name: mall_order_invoice fk_create_user; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_invoice
    ADD CONSTRAINT fk_create_user FOREIGN KEY (create_user) REFERENCES public.sys_user(user_id);


--
-- Name: mall_user_collection fk_demand; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_collection
    ADD CONSTRAINT fk_demand FOREIGN KEY (demand_id) REFERENCES public.mall_buyer_demand(demand_id);


--
-- Name: mall_order_aftersale fk_item; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_aftersale
    ADD CONSTRAINT fk_item FOREIGN KEY (item_id) REFERENCES public.mall_order_item(item_id);


--
-- Name: mall_order_invoice fk_order; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_invoice
    ADD CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES public.mall_order_main(order_id);


--
-- Name: mall_order_item fk_order; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_item
    ADD CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES public.mall_order_main(order_id);


--
-- Name: mall_order_aftersale fk_order; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_aftersale
    ADD CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES public.mall_order_main(order_id);


--
-- Name: financing_presale_plan fk_presale_plan_category; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_presale_plan
    ADD CONSTRAINT fk_presale_plan_category FOREIGN KEY (category_id) REFERENCES public.mall_product_category(category_id) ON DELETE RESTRICT;


--
-- Name: financing_presale_plan fk_presale_plan_user; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_presale_plan
    ADD CONSTRAINT fk_presale_plan_user FOREIGN KEY (user_id) REFERENCES public.sys_user(user_id) ON DELETE RESTRICT;


--
-- Name: sys_user_cert_material fk_replace_material; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_cert_material
    ADD CONSTRAINT fk_replace_material FOREIGN KEY (replace_material_id) REFERENCES public.sys_user_cert_material(material_id);


--
-- Name: mall_user_follow fk_seller; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_follow
    ADD CONSTRAINT fk_seller FOREIGN KEY (seller_id) REFERENCES public.sys_user(user_id);


--
-- Name: mall_order_item fk_source; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_item
    ADD CONSTRAINT fk_source FOREIGN KEY (source_id) REFERENCES public.mall_farmer_source(source_id);


--
-- Name: mall_user_collection fk_source; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_collection
    ADD CONSTRAINT fk_source FOREIGN KEY (source_id) REFERENCES public.mall_farmer_source(source_id);


--
-- Name: financing_presale_subscription fk_subscription_plan; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_presale_subscription
    ADD CONSTRAINT fk_subscription_plan FOREIGN KEY (plan_id) REFERENCES public.financing_presale_plan(plan_id) ON DELETE CASCADE;


--
-- Name: financing_presale_subscription fk_subscription_user; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.financing_presale_subscription
    ADD CONSTRAINT fk_subscription_user FOREIGN KEY (user_id) REFERENCES public.sys_user(user_id) ON DELETE RESTRICT;


--
-- Name: sys_user_cert_material fk_upload_user; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_cert_material
    ADD CONSTRAINT fk_upload_user FOREIGN KEY (upload_user_id) REFERENCES public.sys_user(user_id);


--
-- Name: sys_user_cert_apply fk_user; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_cert_apply
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.sys_user(user_id);


--
-- Name: mall_user_footprint fk_user; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_footprint
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.sys_user(user_id);


--
-- Name: mall_user_follow fk_user; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_follow
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.sys_user(user_id);


--
-- Name: mall_user_collection fk_user; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_collection
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.sys_user(user_id);


--
-- Name: mall_operation_log fk_user; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_operation_log
    ADD CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES public.sys_user(user_id);


--
-- Name: mall_buyer_demand mall_buyer_demand_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_buyer_demand
    ADD CONSTRAINT mall_buyer_demand_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.mall_product_category(category_id);


--
-- Name: mall_buyer_demand mall_buyer_demand_delivery_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_buyer_demand
    ADD CONSTRAINT mall_buyer_demand_delivery_address_id_fkey FOREIGN KEY (delivery_address_id) REFERENCES public.sys_user_address(address_id);


--
-- Name: mall_buyer_demand mall_buyer_demand_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_buyer_demand
    ADD CONSTRAINT mall_buyer_demand_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.sys_user(user_id);


--
-- Name: mall_coupon_rule mall_coupon_rule_create_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_coupon_rule
    ADD CONSTRAINT mall_coupon_rule_create_user_fkey FOREIGN KEY (create_user) REFERENCES public.sys_user(user_id);


--
-- Name: mall_discount_activity mall_discount_activity_create_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_discount_activity
    ADD CONSTRAINT mall_discount_activity_create_user_fkey FOREIGN KEY (create_user) REFERENCES public.sys_user(user_id);


--
-- Name: mall_farmer_source mall_farmer_source_audit_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_farmer_source
    ADD CONSTRAINT mall_farmer_source_audit_user_fkey FOREIGN KEY (audit_user) REFERENCES public.sys_user(user_id);


--
-- Name: mall_farmer_source mall_farmer_source_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_farmer_source
    ADD CONSTRAINT mall_farmer_source_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.mall_product_category(category_id);


--
-- Name: mall_farmer_source mall_farmer_source_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_farmer_source
    ADD CONSTRAINT mall_farmer_source_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.sys_user(user_id);


--
-- Name: mall_order_main mall_order_main_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_main
    ADD CONSTRAINT mall_order_main_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.sys_user(user_id);


--
-- Name: mall_order_main mall_order_main_demand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_main
    ADD CONSTRAINT mall_order_main_demand_id_fkey FOREIGN KEY (demand_id) REFERENCES public.mall_buyer_demand(demand_id);


--
-- Name: mall_order_main mall_order_main_match_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_main
    ADD CONSTRAINT mall_order_main_match_id_fkey FOREIGN KEY (match_id) REFERENCES public.mall_supply_demand_match(match_id);


--
-- Name: mall_order_main mall_order_main_receiver_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_main
    ADD CONSTRAINT mall_order_main_receiver_address_id_fkey FOREIGN KEY (receiver_address_id) REFERENCES public.sys_user_address(address_id);


--
-- Name: mall_order_main mall_order_main_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_main
    ADD CONSTRAINT mall_order_main_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.sys_user(user_id);


--
-- Name: mall_order_main mall_order_main_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_order_main
    ADD CONSTRAINT mall_order_main_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.mall_farmer_source(source_id);


--
-- Name: mall_supply_demand_match mall_supply_demand_match_buyer_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_supply_demand_match
    ADD CONSTRAINT mall_supply_demand_match_buyer_id_fkey FOREIGN KEY (buyer_id) REFERENCES public.sys_user(user_id);


--
-- Name: mall_supply_demand_match mall_supply_demand_match_demand_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_supply_demand_match
    ADD CONSTRAINT mall_supply_demand_match_demand_id_fkey FOREIGN KEY (demand_id) REFERENCES public.mall_buyer_demand(demand_id);


--
-- Name: mall_supply_demand_match mall_supply_demand_match_seller_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_supply_demand_match
    ADD CONSTRAINT mall_supply_demand_match_seller_id_fkey FOREIGN KEY (seller_id) REFERENCES public.sys_user(user_id);


--
-- Name: mall_supply_demand_match mall_supply_demand_match_source_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_supply_demand_match
    ADD CONSTRAINT mall_supply_demand_match_source_id_fkey FOREIGN KEY (source_id) REFERENCES public.mall_farmer_source(source_id);


--
-- Name: mall_user_coupon mall_user_coupon_rule_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_coupon
    ADD CONSTRAINT mall_user_coupon_rule_id_fkey FOREIGN KEY (rule_id) REFERENCES public.mall_coupon_rule(rule_id);


--
-- Name: mall_user_coupon mall_user_coupon_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.mall_user_coupon
    ADD CONSTRAINT mall_user_coupon_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.sys_user(user_id);


--
-- Name: sys_user_address sys_user_address_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_address
    ADD CONSTRAINT sys_user_address_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.sys_user(user_id);


--
-- Name: sys_user_buyer sys_user_buyer_default_address_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_buyer
    ADD CONSTRAINT sys_user_buyer_default_address_id_fkey FOREIGN KEY (default_address_id) REFERENCES public.sys_user_address(address_id);


--
-- Name: sys_user_buyer sys_user_buyer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_buyer
    ADD CONSTRAINT sys_user_buyer_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.sys_user(user_id);


--
-- Name: sys_user_farmer sys_user_farmer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: agri_root
--

ALTER TABLE ONLY public.sys_user_farmer
    ADD CONSTRAINT sys_user_farmer_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.sys_user(user_id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict tRPtXedoBsgBpJd7ATeA27XeYkGWH9aWP5TOzJR3DfgoesUPwAgDbBtjndd9F43

