// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn save() -> String {
    String::from("save")
}

#[tauri::command]
fn levenshtein_distance(first: &str, second: &str) -> u32 {
    if first == second {
        return 0;
    }
    1
}

#[tauri::command]
fn log(log: &str) {
    println!("{}", log)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save, levenshtein_distance, log])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
