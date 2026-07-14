-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "permissions" (
    "id" SERIAL NOT NULL,
    "action_code" VARCHAR(50) NOT NULL,
    "description" VARCHAR(255),

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "role_id" INTEGER NOT NULL,
    "permission_id" INTEGER NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_roles" (
    "user_id" UUID NOT NULL,
    "role_id" INTEGER NOT NULL,

    CONSTRAINT "user_roles_pkey" PRIMARY KEY ("user_id","role_id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" VARCHAR(50) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "form_id" UUID NOT NULL,
    "label" VARCHAR(255) NOT NULL,
    "type" VARCHAR(20) NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "is_required" BOOLEAN NOT NULL DEFAULT false,
    "options" JSONB,
    "validation" JSONB,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forms" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "created_by" UUID NOT NULL,

    CONSTRAINT "forms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "submissions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "form_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "submitted_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "answers" JSONB NOT NULL,

    CONSTRAINT "submissions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "permissions_action_code_key" ON "permissions"("action_code");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "fk_role_permissions_permission" FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "fk_role_permissions_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "fk_user_roles_role" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_roles" ADD CONSTRAINT "fk_user_roles_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fields" ADD CONSTRAINT "fk_fields_form" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "forms" ADD CONSTRAINT "fk_forms_created_by" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "fk_submissions_form" FOREIGN KEY ("form_id") REFERENCES "forms"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "submissions" ADD CONSTRAINT "fk_submissions_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;


-- --------------------------------------------------------
-- Seed Initial Data
-- --------------------------------------------------------

-- Seed Permissions
INSERT INTO "permissions" (action_code, description) VALUES
('CREATE_FORM', 'Tạo Form'),
('SUBMIT_FORM', 'Gửi Form'),
('VIEW_FORM', 'Xem Form'),
('UPDATE_FORM', 'Cập nhật Form'),
('DELETE_FORM', 'Xóa Form'),
('CREATE_FIELD', 'Tạo Field'),
('UPDATE_FIELD', 'Cập nhật Field'),
('DELETE_FIELD', 'Xóa Field'),
('VIEW_SUBMISSIONS', 'Xem danh sách đã nộp của mình'),
('VIEW_ALL_SUBMISSIONS', 'Xem toàn bộ lịch sử nộp');

-- Seed Roles
INSERT INTO "roles" (name) VALUES
('admin'),
('employee');

-- Seed Role Permissions (Admin gets all, Employee gets basic)
INSERT INTO "role_permissions" (role_id, permission_id)
SELECT r.id, p.id FROM "roles" r CROSS JOIN "permissions" p WHERE r.name = 'admin';

INSERT INTO "role_permissions" (role_id, permission_id)
SELECT r.id, p.id FROM "roles" r CROSS JOIN "permissions" p
WHERE r.name = 'employee' AND p.action_code IN ('SUBMIT_FORM', 'VIEW_FORM', 'VIEW_SUBMISSIONS');

-- Seed Admin User (password is '123456' hashed with bcrypt)
INSERT INTO "users" (id, username, email, password_hash, is_active) VALUES
(gen_random_uuid(), 'admin', 'admin@gmail.com', '$2b$10$GTeIgXaCgdprwLY82IrVQ.iqgUyZdFmrNFdNIYKDcC6mjMkJp8lD.', true);

-- Assign Admin Role to Admin User
INSERT INTO "user_roles" (user_id, role_id)
SELECT u.id, r.id FROM "users" u CROSS JOIN "roles" r
WHERE u.username = 'admin' AND r.name = 'admin';

