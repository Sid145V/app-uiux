#!/bin/bash
# Miror Project Automatic Backup Script
set -e

SRC_DIR="/Users/apple/.gemini/antigravity/scratch/miror-symptom-tracker"
BACKUP_ROOT="/Users/apple/Desktop/Antigravity Files"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
DEST_DIR="${BACKUP_ROOT}/${TIMESTAMP}"

# Ensure backup root directory exists
mkdir -p "${BACKUP_ROOT}"
mkdir -p "${DEST_DIR}"

# Copy all project files excluding generated/temporary folders
rsync -av \
  --exclude="node_modules" \
  --exclude=".git" \
  --exclude=".DS_Store" \
  --exclude="*.log" \
  --exclude="backup.sh" \
  "${SRC_DIR}/" "${DEST_DIR}/" > /dev/null

echo "✅ Backup created successfully at: ${DEST_DIR}"
