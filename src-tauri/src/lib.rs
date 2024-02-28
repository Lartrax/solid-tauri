// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn word_distance(first: &str, second: &str) -> f32 {
    // If first is 3 or larger we check if second contains first
    // This way we avoid calculating distance for obvious words
    if second.contains(first) && first.len() > 2 {
        return 0.0;
    }

    // Set base to longest
    let base: Vec<char> = if first.len() > second.len() {
        first.chars().collect()
    } else {
        second.chars().collect()
    };

    let comp: Vec<char> = if first.len() > second.len() {
        second.chars().collect()
    } else {
        first.chars().collect()
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

use serde::Serialize;

#[derive(Serialize)]
struct PrimeResponse {
    duration: String,
    primes: Vec<u32>,
}

#[tauri::command]
fn get_primes(limit: u32) -> PrimeResponse {
    let count = limit;

    use std::time::Instant;

    let timer = Instant::now();
    if count > 20000000 {
        return PrimeResponse {
            duration: format!("{:?}", timer.elapsed()),
            primes: vec![],
        };
    }
    if count < 11 {
        return PrimeResponse {
            duration: format!("{:?}", timer.elapsed()),
            primes: vec![2, 3, 5, 7],
        };
    }
    let mut list_numbers: Vec<u32> = Vec::with_capacity(count as usize - 1);

    list_numbers.push(2);
    list_numbers.push(3);
    list_numbers.push(5);
    for i in 7..=count {
        if i % 2 == 0 || i % 5 == 0 || i % 3 == 0 {
            continue;
        }
        list_numbers.push(i)
    }

    let mut index: usize = 3;

    loop {
        let mut mutable_list_numbers = list_numbers.clone();
        mutable_list_numbers.retain(|&n| n % list_numbers[index] != 0 || n == list_numbers[index]);
        list_numbers = mutable_list_numbers;
        index += 1;
        if list_numbers[index] * list_numbers[index] >= list_numbers.len() as u32 {
            break;
        }
    }

    PrimeResponse {
        duration: format!("{:?}", timer.elapsed()),
        primes: list_numbers,
    }
}

#[tauri::command]
fn log(log: &str) {
    println!("{}", log.replace('"', ""))
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![word_distance, log, get_primes])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
