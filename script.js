const scoreTableHead = document.getElementById("scoreTableHead");
const scoreTableBody = document.getElementById("scoreTableBody");

const btnAddStudent = document.getElementById("btnAddStudent");
const btnAddQuestion = document.getElementById("btnAddQuestion");
const btnResetTable = document.getElementById("btnResetTable");

const groupPercentInput = document.getElementById("groupPercent");
const rTableInput = document.getElementById("rTable");

const btnAnalyze = document.getElementById("btnAnalyze");
const btnSample = document.getElementById("btnSample");
const btnSampleTop = document.getElementById("btnSampleTop");
const btnClear = document.getElementById("btnClear");
const btnExport = document.getElementById("btnExport");
const btnPrint = document.getElementById("btnPrint");

const alertBox = document.getElementById("alertBox");
const resultsSection = document.getElementById("results");

const totalRespondents = document.getElementById("totalRespondents");
const totalItems = document.getElementById("totalItems");
const meanScore = document.getElementById("meanScore");
const reliabilityScore = document.getElementById("reliabilityScore");
const reliabilityLabel = document.getElementById("reliabilityLabel");

const itemTableBody = document.getElementById("itemTableBody");
const studentTableBody = document.getElementById("studentTableBody");

let latestAnalysis = null;

let studentCount = 5;
let questionCount = 5;

function renderInputTable() {
  scoreTableHead.innerHTML = "";
  scoreTableBody.innerHTML = "";

  let headHTML = `
    <tr>
      <th>Nama Siswa</th>
  `;

  for (let i = 1; i <= questionCount; i++) {
    headHTML += `<th>S${i}</th>`;
  }

  headHTML += `<th>Aksi</th></tr>`;
  scoreTableHead.innerHTML = headHTML;

  for (let row = 1; row <= studentCount; row++) {
    let rowHTML = `
      <tr>
        <td>
          <input 
            type="text" 
            class="student-name" 
            placeholder="Nama siswa ${row}"
            value="Siswa ${row}"
          >
        </td>
    `;

    for (let col = 1; col <= questionCount; col++) {
      rowHTML += `
        <td>
          <input 
            type="text" 
            class="score-input" 
            maxlength="1"
            inputmode="numeric"
            placeholder="0/1"
            oninput="validateScoreInput(this)"
            onkeypress="return onlyZeroOne(event)"
          >
        </td>
      `;
    }

    rowHTML += `
        <td>
          <button class="delete-row-btn" type="button" onclick="deleteStudentRow(this)">
            Hapus
          </button>
        </td>
      </tr>
    `;

    scoreTableBody.innerHTML += rowHTML;
  }
}

function validateScoreInput(input) {
  const value = input.value;

  if (value !== "0" && value !== "1") {
    input.value = "";
  }
}

function onlyZeroOne(event) {
  const key = event.key;

  if (key === "0" || key === "1") {
    return true;
  }

  return false;
}

function deleteStudentRow(button) {
  const row = button.closest("tr");
  row.remove();
}

function saveCurrentTableData() {
  const rows = Array.from(scoreTableBody.querySelectorAll("tr"));

  return rows.map((row) => {
    return {
      name: row.querySelector(".student-name").value,
      scores: Array.from(row.querySelectorAll(".score-input")).map((input) => input.value),
    };
  });
}

function restoreTableData(data) {
  const rows = Array.from(scoreTableBody.querySelectorAll("tr"));

  rows.forEach((row, rowIndex) => {
    if (!data[rowIndex]) return;

    row.querySelector(".student-name").value = data[rowIndex].name;

    const inputs = Array.from(row.querySelectorAll(".score-input"));

    inputs.forEach((input, colIndex) => {
      if (data[rowIndex].scores[colIndex] !== undefined) {
        input.value = data[rowIndex].scores[colIndex];
      }
    });
  });
}

function getDataFromTable() {
  const rows = Array.from(scoreTableBody.querySelectorAll("tr"));

  if (rows.length < 2) {
    throw new Error("Minimal harus ada 2 siswa/responden.");
  }

  const names = [];
  const matrix = [];

  rows.forEach((row, rowIndex) => {
    const nameInput = row.querySelector(".student-name");
    const scoreInputs = row.querySelectorAll(".score-input");

    const name = nameInput.value.trim() || `Siswa ${rowIndex + 1}`;
    const scores = [];

    scoreInputs.forEach((input, colIndex) => {
      const value = input.value.trim();

      if (value === "") {
        throw new Error(`Nilai pada ${name}, soal ${colIndex + 1} belum diisi.`);
      }

      const numberValue = Number(value);

      if (numberValue !== 0 && numberValue !== 1) {
        throw new Error(`Nilai pada ${name}, soal ${colIndex + 1} harus 0 atau 1.`);
      }

      scores.push(numberValue);
    });

    names.push(name);
    matrix.push(scores);
  });

  if (questionCount < 2) {
    throw new Error("Minimal harus ada 2 butir soal.");
  }

  const itemLabels = Array.from(
    { length: questionCount },
    (_, index) => `Soal ${index + 1}`
  );

  return {
    names,
    matrix,
    itemLabels,
  };
}

function fillSampleTable() {
  studentCount = 8;
  questionCount = 5;
  renderInputTable();

  const sampleNames = [
    "Ayu",
    "Bima",
    "Cici",
    "Dedi",
    "Eka",
    "Fajar",
    "Gina",
    "Hana",
  ];

  const sampleScores = [
    [1, 1, 0, 1, 1],
    [1, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 0, 0, 1],
    [1, 0, 1, 0, 1],
    [0, 0, 0, 0, 1],
    [1, 1, 1, 1, 0],
    [1, 0, 1, 1, 1],
  ];

  const rows = scoreTableBody.querySelectorAll("tr");

  rows.forEach((row, rowIndex) => {
    row.querySelector(".student-name").value = sampleNames[rowIndex];

    const inputs = row.querySelectorAll(".score-input");

    inputs.forEach((input, colIndex) => {
      input.value = sampleScores[rowIndex][colIndex];
    });
  });

  document.getElementById("analisis").scrollIntoView({
    behavior: "smooth",
  });
}

function showAlert(message, type = "error") {
  alertBox.className = `alert ${type}`;
  alertBox.textContent = message;
}

function hideAlert() {
  alertBox.className = "alert hidden";
  alertBox.textContent = "";
}

btnAddStudent.addEventListener("click", () => {
  const oldData = saveCurrentTableData();

  studentCount++;
  renderInputTable();
  restoreTableData(oldData);
});

btnAddQuestion.addEventListener("click", () => {
  const oldData = saveCurrentTableData();

  questionCount++;
  renderInputTable();
  restoreTableData(oldData);
});

btnResetTable.addEventListener("click", () => {
  studentCount = 5;
  questionCount = 5;
  renderInputTable();
  latestAnalysis = null;
  hideAlert();
  resultsSection.classList.add("hidden");
});

btnSample.addEventListener("click", fillSampleTable);

if (btnSampleTop) {
  btnSampleTop.addEventListener("click", fillSampleTable);
}

btnClear.addEventListener("click", () => {
  studentCount = 5;
  questionCount = 5;
  renderInputTable();
  latestAnalysis = null;
  hideAlert();
  resultsSection.classList.add("hidden");
});

btnPrint.addEventListener("click", () => {
  window.print();
});

btnAnalyze.addEventListener("click", () => {
  try {
    hideAlert();

    const parsed = getDataFromTable();
    const groupPercent = Number(groupPercentInput.value);

    const rTableValue =
      rTableInput.value.trim() === "" ? null : Number(rTableInput.value);

    if (
      rTableValue !== null &&
      (Number.isNaN(rTableValue) || rTableValue < 0)
    ) {
      throw new Error("R tabel harus berupa angka positif, misalnya 0.361.");
    }

    const analysis = analyzeData(parsed, groupPercent, rTableValue);
    latestAnalysis = analysis;

    renderResults(analysis);

    showAlert("Data berhasil dianalisis.", "success");

    resultsSection.classList.remove("hidden");

    resultsSection.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  } catch (error) {
    showAlert(error.message, "error");

    alertBox.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
});

btnExport.addEventListener("click", () => {
  if (!latestAnalysis) {
    showAlert("Belum ada data yang dianalisis.", "error");

    alertBox.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    return;
  }

  exportCSV(latestAnalysis);
});

function analyzeData(parsed, groupPercent, rTable) {
  const { names, matrix, itemLabels } = parsed;

  const n = matrix.length;
  const k = matrix[0].length;

  const totalScores = matrix.map((row) => sum(row));

  const sortedStudents = matrix
    .map((row, index) => ({
      name: names[index],
      scores: row,
      total: totalScores[index],
      percentage: totalScores[index] / k,
      originalIndex: index,
    }))
    .sort((a, b) => b.total - a.total);

  const groupSize = Math.max(1, Math.floor(n * groupPercent));

  const upperGroup = sortedStudents.slice(0, groupSize);
  const lowerGroup = sortedStudents.slice(-groupSize);

  const totalVariance = sampleVariance(totalScores);

  const itemResults = [];

  for (let itemIndex = 0; itemIndex < k; itemIndex++) {
    const itemScores = matrix.map((row) => row[itemIndex]);

    const correctCount = sum(itemScores);
    const difficulty = correctCount / n;

    const upperP = mean(
      upperGroup.map((student) => student.scores[itemIndex])
    );

    const lowerP = mean(
      lowerGroup.map((student) => student.scores[itemIndex])
    );

    const discrimination = upperP - lowerP;

    const correctedTotal = matrix.map((row) => sum(row) - row[itemIndex]);

    const rValue = pearson(itemScores, correctedTotal);

    const difficultyLabel = classifyDifficulty(difficulty);
    const discriminationLabel = classifyDiscrimination(discrimination);
    const validityLabel = classifyValidity(rValue, rTable);

    const recommendation = getRecommendation({
      difficulty,
      discrimination,
      rValue,
      rTable,
    });

    itemResults.push({
      no: itemIndex + 1,
      label: itemLabels[itemIndex],
      correctCount,
      difficulty,
      difficultyLabel,
      discrimination,
      discriminationLabel,
      rValue,
      validityLabel,
      recommendation,
    });
  }

  const pqSum = itemResults.reduce((acc, item) => {
    const p = item.difficulty;
    const q = 1 - p;

    return acc + p * q;
  }, 0);

  let reliability = null;

  if (k > 1 && totalVariance > 0) {
    reliability = (k / (k - 1)) * (1 - pqSum / totalVariance);
  }

  return {
    n,
    k,
    groupSize,
    totalScores,
    meanTotal: mean(totalScores),
    maxScore: Math.max(...totalScores),
    reliability,
    reliabilityCategory: classifyReliability(reliability),
    itemResults,
    sortedStudents,
    rTable,
  };
}

function sum(values) {
  return values.reduce((acc, value) => acc + value, 0);
}

function mean(values) {
  if (!values.length) return 0;

  return sum(values) / values.length;
}

function sampleVariance(values) {
  if (values.length < 2) return 0;

  const avg = mean(values);

  const total = values.reduce((acc, value) => {
    return acc + Math.pow(value - avg, 2);
  }, 0);

  return total / (values.length - 1);
}

function pearson(x, y) {
  if (x.length !== y.length || x.length < 2) return 0;

  const meanX = mean(x);
  const meanY = mean(y);

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < x.length; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;

    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  const denominator = Math.sqrt(denomX * denomY);

  if (denominator === 0) return 0;

  return numerator / denominator;
}

function classifyDifficulty(value) {
  if (value <= 0.30) {
    return {
      text: "Sukar",
      tone: "bad",
    };
  }

  if (value <= 0.70) {
    return {
      text: "Sedang",
      tone: "good",
    };
  }

  return {
    text: "Mudah",
    tone: "mid",
  };
}

function classifyDiscrimination(value) {
  if (value < 0) {
    return {
      text: "Buruk",
      tone: "bad",
    };
  }

  if (value < 0.20) {
    return {
      text: "Jelek",
      tone: "bad",
    };
  }

  if (value < 0.40) {
    return {
      text: "Cukup",
      tone: "mid",
    };
  }

  if (value < 0.70) {
    return {
      text: "Baik",
      tone: "good",
    };
  }

  return {
    text: "Sangat Baik",
    tone: "good",
  };
}

function classifyValidity(value, rTable) {
  if (rTable !== null) {
    if (value >= rTable) {
      return {
        text: "Valid",
        tone: "good",
      };
    }

    return {
      text: "Tidak Valid",
      tone: "bad",
    };
  }

  const abs = Math.abs(value);

  if (abs < 0.20) {
    return {
      text: "Sangat Rendah",
      tone: "bad",
    };
  }

  if (abs < 0.40) {
    return {
      text: "Rendah",
      tone: "mid",
    };
  }

  if (abs < 0.60) {
    return {
      text: "Sedang",
      tone: "good",
    };
  }

  if (abs < 0.80) {
    return {
      text: "Tinggi",
      tone: "good",
    };
  }

  return {
    text: "Sangat Tinggi",
    tone: "good",
  };
}

function classifyReliability(value) {
  if (value === null || Number.isNaN(value)) {
    return {
      text: "Tidak dapat dihitung",
      tone: "bad",
    };
  }

  if (value < 0.20) {
    return {
      text: "Sangat Rendah",
      tone: "bad",
    };
  }

  if (value < 0.40) {
    return {
      text: "Rendah",
      tone: "bad",
    };
  }

  if (value < 0.60) {
    return {
      text: "Cukup",
      tone: "mid",
    };
  }

  if (value < 0.80) {
    return {
      text: "Tinggi",
      tone: "good",
    };
  }

  return {
    text: "Sangat Tinggi",
    tone: "good",
  };
}

function getRecommendation({ difficulty, discrimination, rValue, rTable }) {
  const valid = rTable !== null ? rValue >= rTable : rValue >= 0.30;

  if (discrimination < 0 || rValue < 0) {
    return {
      text: "Buang/Revisi besar",
      tone: "bad",
    };
  }

  if (!valid || discrimination < 0.20) {
    return {
      text: "Revisi",
      tone: "mid",
    };
  }

  if (
    difficulty >= 0.31 &&
    difficulty <= 0.70 &&
    discrimination >= 0.40 &&
    valid
  ) {
    return {
      text: "Pakai",
      tone: "good",
    };
  }

  return {
    text: "Cek ulang",
    tone: "mid",
  };
}

function renderResults(analysis) {
  totalRespondents.textContent = analysis.n;
  totalItems.textContent = analysis.k;
  meanScore.textContent = `${formatNumber(analysis.meanTotal)} / ${analysis.k}`;

  if (analysis.reliability === null) {
    reliabilityScore.textContent = "-";
  } else {
    reliabilityScore.textContent = formatNumber(analysis.reliability, 3);
  }

  reliabilityLabel.textContent = analysis.reliabilityCategory.text;
  reliabilityLabel.className = `tag ${analysis.reliabilityCategory.tone}`;

  itemTableBody.innerHTML = analysis.itemResults
    .map((item) => {
      return `
        <tr>
          <td>${item.no}</td>
          <td>${escapeHTML(item.label)}</td>
          <td>${item.correctCount}/${analysis.n}</td>
          <td>${formatNumber(item.difficulty, 3)}</td>
          <td>${tag(item.difficultyLabel)}</td>
          <td>${formatNumber(item.discrimination, 3)}</td>
          <td>${tag(item.discriminationLabel)}</td>
          <td>${formatNumber(item.rValue, 3)}</td>
          <td>${tag(item.validityLabel)}</td>
          <td>${tag(item.recommendation)}</td>
        </tr>
      `;
    })
    .join("");

  studentTableBody.innerHTML = analysis.sortedStudents
    .map((student, index) => {
      let group = "Tengah";
      let tone = "mid";

      if (index < analysis.groupSize) {
        group = "Atas";
        tone = "good";
      } else if (index >= analysis.sortedStudents.length - analysis.groupSize) {
        group = "Bawah";
        tone = "bad";
      }

      return `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHTML(student.name)}</td>
          <td>${student.total}/${analysis.k}</td>
          <td>${formatNumber(student.percentage * 100, 1)}%</td>
          <td>
            <span class="tag ${tone}">${group}</span>
          </td>
        </tr>
      `;
    })
    .join("");
}

function tag(data) {
  return `<span class="tag ${data.tone}">${data.text}</span>`;
}

function formatNumber(value, decimals = 2) {
  if (value === null || Number.isNaN(value)) return "-";

  return Number(value)
    .toFixed(decimals)
    .replace(/\.?0+$/, "");
}

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function exportCSV(analysis) {
  const header = [
    "No",
    "Butir",
    "Benar",
    "P Kesukaran",
    "Kategori Kesukaran",
    "Daya Pembeda",
    "Kategori Daya Pembeda",
    "R Hitung",
    "Validitas",
    "Rekomendasi",
  ];

  const rows = analysis.itemResults.map((item) => [
    item.no,
    item.label,
    `${item.correctCount}/${analysis.n}`,
    formatNumber(item.difficulty, 3),
    item.difficultyLabel.text,
    formatNumber(item.discrimination, 3),
    item.discriminationLabel.text,
    formatNumber(item.rValue, 3),
    item.validityLabel.text,
    item.recommendation.text,
  ]);

  const summaryRows = [
    [],
    ["Ringkasan"],
    ["Jumlah Responden", analysis.n],
    ["Jumlah Soal", analysis.k],
    ["Rata-rata Skor", formatNumber(analysis.meanTotal, 3)],
    [
      "Reliabilitas KR-20",
      analysis.reliability === null
        ? "-"
        : formatNumber(analysis.reliability, 3),
    ],
    ["Kategori Reliabilitas", analysis.reliabilityCategory.text],
  ];

  const csvContent = [header, ...rows, ...summaryRows]
    .map((row) => row.map(csvCell).join(","))
    .join("\n");

  const blob = new Blob([csvContent], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "hasil-analisis-evaluasi-pembelajaran.csv";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

function csvCell(value) {
  const stringValue = String(value ?? "");

  if (
    stringValue.includes(",") ||
    stringValue.includes('"') ||
    stringValue.includes("\n")
  ) {
    return `"${stringValue.replaceAll('"', '""')}"`;
  }

  return stringValue;
}

renderInputTable();