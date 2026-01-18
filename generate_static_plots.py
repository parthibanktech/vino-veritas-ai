import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os

# Ensure the static directory exists
os.makedirs("static/plots", exist_ok=True)

# Load dataset
df = pd.read_csv("winequality-red_par.csv")

# Set premium style for matplotlib
plt.style.use('ggplot')
sns.set_palette("colorblind")

# 1. Individual Feature Distributions
# 1. Individual High-Contrast Distributions
columns_to_plot = df.drop(columns=['quality']).columns

for column in columns_to_plot:
    plt.figure(figsize=(10, 8), facecolor='white')  
    sns.set_style("whitegrid")  # Cleaner white background
    
    # Plotting with bold red color
    sns.histplot(df[column], kde=True, color='#800000', bins=30, alpha=0.7)
    
    # Enhanced Text Clarity
    plt.title(f'{column.replace("_", " ").title()} Profile', fontsize=24, fontweight='bold', color='#1a1a1a', pad=25)
    plt.xlabel(column.replace("_", " ").title(), fontsize=18, fontweight='bold', color='#333333', labelpad=15)
    plt.ylabel('Scientific Batch Frequency', fontsize=18, fontweight='bold', color='#333333', labelpad=15)
    
    # Tick Clarity
    plt.xticks(fontsize=14, fontweight='bold', color='#444444')
    plt.yticks(fontsize=14, fontweight='bold', color='#444444')
    
    plt.tight_layout()
    filename = column.replace(" ", "_")
    plt.savefig(f"static/plots/dist_{filename}.png", dpi=300, bbox_inches='tight', facecolor='white') 
    plt.close()

print("High-contrast 300 DPI snapshots generated successfully.")

# 2. Quality Distribution (Ultra-HD)
plt.figure(figsize=(10, 8), facecolor='white')
sns.set_style("whitegrid")
sns.histplot(df['quality'], bins=6, color='#991b1b', alpha=0.8)
plt.title('Final Quality Yield Analysis', fontsize=24, fontweight='bold', color='#1a1a1a', pad=25)
plt.xlabel('Quality Rating (Enological Scale)', fontsize=18, fontweight='bold', color='#333333')
plt.ylabel('Vat Count', fontsize=18, fontweight='bold', color='#333333')
plt.xticks(fontsize=14, fontweight='bold')
plt.yticks(fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig("static/plots/quality_distribution.png", dpi=300, facecolor='white')
plt.close()

# 3. Correlation Matrix (Ultra-HD Full Square)
plt.figure(figsize=(16, 14), facecolor='white')
correlation = df.corr()

# Removed the triangle mask to show every data point (Full Symmetry)
sns.heatmap(correlation, annot=True, fmt=".2f", cmap='RdBu_r', center=0,
            square=True, linewidths=1.0, cbar_kws={"shrink": .8},
            annot_kws={"size": 13, "weight": "bold"})

plt.title('Global Chemical Dependency Matrix (Full Sample Set)', fontsize=28, fontweight='bold', color='#1a1a1a', pad=40)
plt.xticks(fontsize=14, fontweight='bold', rotation=45, ha='right')
plt.yticks(fontsize=14, fontweight='bold')
plt.tight_layout()
plt.savefig("static/plots/correlation_matrix.png", dpi=300, facecolor='white')
plt.close()

print("Static Pyplot snapshots generated successfully in static/plots/")
