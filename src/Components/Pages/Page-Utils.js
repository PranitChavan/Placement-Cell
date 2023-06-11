import { supabase } from '../../Config/supabase.client';

const DEPARTMENTS = new Map([
  [1, { stream: 'COMPSCI-BSC', department: 'Science' }],
  [2, { stream: 'COMPSCI-MSC', department: 'Science' }],
  [3, { stream: 'COMMERCE-BCOM', department: 'Commerce' }],
  [4, { stream: 'COMMERCE-MCOM', department: 'Commerce' }],
]);

export function findDepartmentId(department) {
  for (const [key, value] of DEPARTMENTS.entries()) {
    if (value.stream === department.stream && value.department === department.department) {
      return key;
    }
  }

  return null;
}

async function deleteOa(uid) {
  const { data, error } = await supabase.from('Department_LNK').delete().eq('user_id', uid);

  if (error) throw new Error('Failed deleteing');

  return data;
}

export async function updateDepartmentLiking([currentUser, departmentId]) {
  const isDeleted = await deleteOa(currentUser.uid);

  const { data, error } = await supabase
    .from('Department_LNK')
    .upsert({ lnk_id: Date.now(), department_id: departmentId.toString(), user_id: currentUser.uid });

  if (error) throw new Error('Failed!');

  return data;
}
