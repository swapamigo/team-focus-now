# Evidence for the employer page

Updated 2026-09-15. Scope: `/fuer-arbeitgeber`, German, English and Spanish.

The page explains interruption costs, potential business value and employee wellbeing. Research details are collapsed to keep the page concise. It does not present a measured TeamFokus return on investment or equate unlock counts with focus, errors or time saved.

- **Task resumption:** Iqbal & Horvitz, *Disruption and Recovery of Computing Tasks*, CHI 2007. [Publication](https://www.microsoft.com/en-us/research/publication/disruption-recovery-computing-tasks-field-study-analysis-directions/), [paper](https://www.microsoft.com/en-us/research/wp-content/uploads/2016/11/CHI_2007_Iqbal_Horvitz-1.pdf). The summary reports an additional 10–15 minutes on average in the resumption phase after alert-driven diversions. This was a field study of 27 computer users over two weeks, with email and instant messaging alerts. It is not a universal physiological recovery time or a per-unlock multiplier.
- **Errors:** Altmann, Trafton & Hambrick, *Momentary interruptions can derail the train of thought*, Journal of Experimental Psychology: General 143(1), 215–226 (2014). [DOI](https://doi.org/10.1037/a0030986). Brief laboratory interruptions increased sequence errors in a multi-step task. The page avoids transferring experimental error percentages to customers.
- **Wellbeing:** Brailovskaia et al., *Less smartphone and more physical activity for a better work satisfaction, motivation, work-life balance, and mental health*, Acta Psychologica (2024). [DOI](https://doi.org/10.1016/j.actpsy.2024.104494), [university report](https://news.rub.de/presseinformationen/wissenschaft/2024-09-17-psychologie-mehr-arbeitszufriedenheit-durch-weniger-smartphone). The four-group study involved 278 working adults. Reducing private smartphone time by one hour a day for a week improved reported job satisfaction, motivation and work-life balance. The study did not test TeamFokus or an unlock-count intervention.

The old “23 minutes until full concentration after every interruption” claim is not reinstated. The previously cited Mark, Gudith & Klocke CHI 2008 paper does not support that number; it reports stress and effort effects, with faster completion and no quality difference in its task. The uploaded project summary independently flags the same attribution problem.

The ROI passage is an economic condition: realised benefits must exceed software, reward and implementation costs. No measured profit lift, addiction treatment or proven TeamFokus outcome is advertised. Healthy habits are framed as a voluntary product goal.

## Editable business case

The company page now includes a local scenario calculator. Following section 9.10 of the uploaded project summary, it uses **avoided active unlocks**, not screen time or an assumed recovery time. The customer supplies the economic value of an avoided unlock. This value must represent additional earnings after incremental costs, or costs actually avoided. It is not a scientific constant or a measured product outcome. No fixed reduction rate or study-derived time multiplier is used.

- Monthly benefit = participating employees × assumed avoided unlocks per workday × workdays × customer's value per avoided unlock.
- Monthly cost = participants × (reward purchase costs + software costs) + other team costs.
- Net value = benefit − cost; ROI = net value / cost × 100.
- Break-even = cost / (participants × workdays × value per unlock), rounded up to a whole daily unlock in the UI.
- Defaults are explicitly examples, not price commitments: 25 participants, 10 fewer unlocks, €0.50 of estimated value per unlock, 20 workdays, €50 rewards and €5 software per participant, €0 shared overhead. They yield €2,500 estimated benefit, €1,375 costs, €1,125 net and 81.8% illustrative ROI. These figures are **not forecasts**.
- All costs can be changed. Shared overhead is counted once; help text covers administration, additional charges and a monthly share of implementation. Reward acquisition cost, including partner discounts, is separate from face value and the shop's point price.
- Zero benefit shows a loss, zero costs leave the ROI percentage undefined, and zero value per unlock cannot cover nonzero costs. Invalid or blank costs suppress the result. Inputs stay in component state; they are not submitted or saved.

The page clearly states that TeamFokus counts active unlocks and does not measure time savings, errors or profit. Research details remain collapsed, with source links beside the corresponding business arguments. The large 10–15-minute statistic has been removed from the sales cards; its original scope remains in the research notes.
