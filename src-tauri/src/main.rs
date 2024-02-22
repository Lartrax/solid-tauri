// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn save() -> String {
    String::from("save")
}

#[tauri::command]
fn word_distance(first: &str, second: &str) -> f32 {
    // If first is 3 og larger we check if second contains first
    // This way we avoid calculating distance for obvious words
    if second.contains(first) && first.len() > 2 {
        return 0.0;
    }

    // Set base to longest
    let base: Vec<char> = if first.len() > second.len() {
        first.to_lowercase().chars().collect()
    } else {
        second.to_lowercase().chars().collect()
    };

    let comp: Vec<char> = if first.len() > second.len() {
        second.to_lowercase().chars().collect()
    } else {
        first.to_lowercase().chars().collect()
    };

    let mut distance = 0.0;

    #[derive(Debug, Clone)]
    struct Moves {
        use_char: bool,
        move_char: (bool, usize),
        add_char: bool,
    }

    let mut movement_construct = vec![
        Moves {
            use_char: false,
            move_char: (false, 0),
            add_char: false
        };
        base.len()
    ];

    for (i, base_char) in base.clone().into_iter().enumerate() {
        for (j, comp_char) in comp.clone().into_iter().enumerate() {
            // Action: Use; Because chars are the same and at the same index
            if base_char == comp_char && i == j {
                movement_construct[i].use_char = true;
            }

            // Action: Move; Because chars are the same but indices are different
            if base_char == comp_char && i != j {
                let diff = i.abs_diff(j);
                movement_construct[i].move_char.0 = true;
                movement_construct[i].move_char.1 = diff;
            }

            // Action: Add; Because char does not exist in comp
            if base_char != comp_char {
                movement_construct[i].add_char = true;
            }
        }
    }

    // Calcualte cost based on best moves: use > move > add
    for movement in movement_construct.clone() {
        if movement.use_char {
            // No distance added
        } else if movement.move_char.0 && movement.move_char.1 < 3 {
            // Only move chars if it is less costly than adding /\
            // Add 0.4 for each index moved
            distance += movement.move_char.1 as f32 * 0.4
        } else if movement.add_char {
            // Add 1 for adding new char
            distance += 1.0
        }
    }

    distance
}

#[tauri::command]
fn log(log: &str) {
    println!("{}", log)
}

use tauri::Manager;
use window_vibrancy::apply_acrylic;

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            let window = app.get_window("main").unwrap();

            apply_acrylic(&window, Some((0, 0, 0, 0)))
                .expect("Unsupported platform! 'apply_acrylic' is only supported on Windows");

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![save, word_distance, log])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
