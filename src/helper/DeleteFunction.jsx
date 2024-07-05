import { supabase } from "../supabase/instance";

export const DeleteFromSupabase = async (tableName, todoId) => {
    const { error } = await supabase
    .from(tableName)
    .delete()
    .eq( "id", todoId );
}