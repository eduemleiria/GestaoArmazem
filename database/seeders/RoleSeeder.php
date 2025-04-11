<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Role de admin
        $role_admin = Role::create(['name' => 'admin']);
        $permission_gestao_users = Permission::create(['name' => 'gestaoUsers']);

        $role_admin->syncPermissions(
            $permission_gestao_users
        );

        $user = User::find(1);
        $user->assignRole($role_admin);

        // Role de gerente
        $role_gerente = Role::create(['name' => 'gerente']);
        
        $permission_editar_doc = Permission::create(['name' => 'editarDoc']);

        $role_gerente->syncPermissions(
            $permission_editar_doc
        );
    }
}
