const SUPABASE_URL = "https://ssbsfqpujqjowrkbyntv.supabase.co";

const SUPABASE_KEY = "sb_publishable_HSEG5YV7SPPmtePuHkx_Pw_56b9Ukw-";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

console.log("Cliente Supabase inicializado");
async function probarLogin(email, password) {

  try {

    const { data, error } =
      await supabaseClient.auth.signInWithPassword({

        email: email,

        password: password

      });

    if (error) {

         console.log(error);

        console.log(error.message);

         return false;

    }

    console.log("Login correcto");

    return true;

  } catch (e) {

    console.log("Error Supabase");

    return false;

  }

}