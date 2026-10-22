package com.gymtracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "muscle_group", nullable = false, length = 50)
    private String muscleGroup;

    @Column(name = "difficulty_level", nullable = false, length = 30)
    private String difficultyLevel = "INTERMEDIATE";

    @Column(name = "equipment_required", nullable = false, length = 120)
    private String equipmentRequired;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String instructions;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    public Exercise() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMuscleGroup() { return muscleGroup; }
    public void setMuscleGroup(String muscleGroup) { this.muscleGroup = muscleGroup; }

    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }

    public String getEquipmentRequired() { return equipmentRequired; }
    public void setEquipmentRequired(String equipmentRequired) { this.equipmentRequired = equipmentRequired; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
