BEGIN;

-- Secure the tables introduced by the baseline migration.
-- This runs after the Legal Updates migration so a clean Supabase project gets
-- the same RLS guarantees as the existing project. It intentionally fails when
-- a policy or constraint has already been created: that indicates schema drift.

CREATE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles AS profile
    WHERE profile.id = auth.uid()::TEXT
      AND profile."platformRole" IN ('PLATFORM_ADMIN', 'SUPER_ADMIN')
  );
$$;

CREATE FUNCTION public.is_active_organization_member(target_organization_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members AS member
    WHERE member."organizationId" = target_organization_id
      AND member."userId" = auth.uid()::TEXT
      AND member.status = 'ACTIVE'
  );
$$;

CREATE FUNCTION public.has_active_organization_role(
  target_organization_id TEXT,
  allowed_roles public."OrganizationRole"[]
)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organization_members AS member
    WHERE member."organizationId" = target_organization_id
      AND member."userId" = auth.uid()::TEXT
      AND member.status = 'ACTIVE'
      AND member.role = ANY (allowed_roles)
  );
$$;

CREATE FUNCTION public.can_access_product(target_product_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT public.is_platform_admin()
        OR public.is_active_organization_member(product."organizationId")
      FROM public.products AS product
      WHERE product.id = target_product_id
    ),
    FALSE
  );
$$;

CREATE FUNCTION public.can_access_batch(target_batch_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT public.is_platform_admin()
        OR public.is_active_organization_member(product."organizationId")
      FROM public.batches AS batch
      JOIN public.products AS product ON product.id = batch."productId"
      WHERE batch.id = target_batch_id
    ),
    FALSE
  );
$$;

CREATE FUNCTION public.can_access_compliance_check(target_check_id TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (
      SELECT public.is_platform_admin()
        OR public.is_active_organization_member(product."organizationId")
      FROM public.compliance_checks AS compliance_check
      JOIN public.batches AS batch ON batch.id = compliance_check."batchId"
      JOIN public.products AS product ON product.id = batch."productId"
      WHERE compliance_check.id = target_check_id
    ),
    FALSE
  );
$$;

REVOKE ALL ON FUNCTION public.is_platform_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.is_active_organization_member(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_active_organization_role(TEXT, public."OrganizationRole"[]) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.can_access_product(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.can_access_batch(TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.can_access_compliance_check(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_platform_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_active_organization_member(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_active_organization_role(TEXT, public."OrganizationRole"[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_product(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_batch(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_compliance_check(TEXT) TO authenticated;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_market_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mrl_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_updates ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.profiles, public.organizations, public.organization_members,
  public.invitations, public.products, public.batches, public.product_market_requirements,
  public.documents, public.batch_documents, public.regulations, public.mrl_limits,
  public.compliance_checks, public.compliance_items, public.reports, public.audit_logs,
  public.notifications, public.legal_updates FROM anon;
REVOKE INSERT, UPDATE, DELETE ON TABLE public.profiles, public.organizations,
  public.organization_members, public.invitations, public.products, public.batches,
  public.product_market_requirements, public.documents, public.batch_documents,
  public.regulations, public.mrl_limits, public.compliance_checks, public.compliance_items,
  public.reports, public.audit_logs, public.notifications, public.legal_updates FROM authenticated;
GRANT SELECT ON TABLE public.profiles, public.organizations, public.organization_members,
  public.invitations, public.products, public.batches, public.product_market_requirements,
  public.documents, public.batch_documents, public.regulations, public.mrl_limits,
  public.compliance_checks, public.compliance_items, public.reports, public.audit_logs,
  public.notifications, public.legal_updates TO authenticated;

CREATE POLICY "profiles_read_own_or_platform_admin"
  ON public.profiles FOR SELECT TO authenticated
  USING (id = auth.uid()::TEXT OR public.is_platform_admin());

CREATE POLICY "organizations_read_member_or_platform_admin"
  ON public.organizations FOR SELECT TO authenticated
  USING (public.is_active_organization_member(id) OR public.is_platform_admin());

CREATE POLICY "organization_members_read_member_or_platform_admin"
  ON public.organization_members FOR SELECT TO authenticated
  USING (
    "userId" = auth.uid()::TEXT
    OR public.is_active_organization_member("organizationId")
    OR public.is_platform_admin()
  );

CREATE POLICY "invitations_read_owner_manager_or_platform_admin"
  ON public.invitations FOR SELECT TO authenticated
  USING (
    public.has_active_organization_role("organizationId", ARRAY['OWNER', 'MANAGER']::public."OrganizationRole"[])
    OR public.is_platform_admin()
  );

CREATE POLICY "products_read_member_or_platform_admin"
  ON public.products FOR SELECT TO authenticated
  USING (public.is_active_organization_member("organizationId") OR public.is_platform_admin());

CREATE POLICY "batches_read_member_or_platform_admin"
  ON public.batches FOR SELECT TO authenticated
  USING (public.can_access_batch(id));

CREATE POLICY "product_market_requirements_read_member_or_platform_admin"
  ON public.product_market_requirements FOR SELECT TO authenticated
  USING (public.can_access_product("productId"));

CREATE POLICY "documents_read_member_or_platform_admin"
  ON public.documents FOR SELECT TO authenticated
  USING (public.is_active_organization_member("organizationId") OR public.is_platform_admin());

CREATE POLICY "batch_documents_read_member_or_platform_admin"
  ON public.batch_documents FOR SELECT TO authenticated
  USING (public.can_access_batch("batchId"));

CREATE POLICY "regulations_read_authenticated"
  ON public.regulations FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "mrl_limits_read_authenticated"
  ON public.mrl_limits FOR SELECT TO authenticated
  USING (TRUE);

CREATE POLICY "compliance_checks_read_member_or_platform_admin"
  ON public.compliance_checks FOR SELECT TO authenticated
  USING (public.can_access_compliance_check(id));

CREATE POLICY "compliance_items_read_member_or_platform_admin"
  ON public.compliance_items FOR SELECT TO authenticated
  USING (public.can_access_compliance_check("complianceCheckId"));

CREATE POLICY "reports_read_member_or_platform_admin"
  ON public.reports FOR SELECT TO authenticated
  USING (public.can_access_compliance_check("complianceCheckId"));

-- Audit logs are append-only: authenticated users may only read their own rows;
-- no INSERT, UPDATE or DELETE grant/policy exists for client roles.
CREATE POLICY "audit_logs_read_own_or_platform_admin"
  ON public.audit_logs FOR SELECT TO authenticated
  USING ("userId" = auth.uid()::TEXT OR public.is_platform_admin());

CREATE POLICY "notifications_read_own_or_platform_admin"
  ON public.notifications FOR SELECT TO authenticated
  USING ("userId" = auth.uid()::TEXT OR public.is_platform_admin());

DROP POLICY "legal_updates_read_published_scoped" ON public.legal_updates;
CREATE POLICY "legal_updates_read_published_scoped"
  ON public.legal_updates FOR SELECT TO authenticated
  USING (
    "reviewStatus" = 'PUBLISHED'
    AND (
      "organizationId" IS NULL
      OR public.is_active_organization_member("organizationId")
      OR public.is_platform_admin()
    )
  );

ALTER TABLE public.legal_updates
  ADD CONSTRAINT "legal_updates_published_requires_published_at"
  CHECK ("reviewStatus" <> 'PUBLISHED' OR "publishedAt" IS NOT NULL);

COMMIT;
