// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn save() -> String {
    String::from("save")
}

#[tauri::command]
fn word_distance(first: &str, second: &str) -> u32 {
    println!("__________________");

    let mut first = first;
    let mut second = second;

    if first == second {
        return 0;
    }

    let first_len = first.chars().count();
    let second_len = second.chars().count();

    // Set maximum difference to length of largest word
    let mut points = if first_len > second_len {
        first_len
    } else {
        second_len
    };

    for (i, cf) in first.chars().enumerate() {
        for (j, cs) in second.chars().enumerate() {
            // Action: Use; Because chars are the same and at the same index
            if cf == cs && i == j {}
        }
    }

    1
}

#[tauri::command]
fn log(log: &str) {
    println!("{}", log)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![save, word_distance, log])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
