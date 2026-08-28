# Tasks: open00 Foundry

## Review Workload-Forecast
Decision needed before apply: Yes
Chained PRs recommended: Yes
Chain strategy: feature-branch-chain
400-line budget risk: High
`Meta=bases:P1=tracker/Pn=previous/tracker→main;lines:120–390/PR+120–300/batch;dist+canonical:excluded;>400:decision;delivery:ask-on-risk;paths:D=src/domain,F=src/foundry,C=src/content,Q=test;T(x)=npm-test---run-x;S=exact-14.367-smoke;E=receipt;DoD=tests+typecheck+build+regression+rollback+provenance+evidence;missing-E=unchecked+NOT-VERIFIED;hierarchy=Capability>Feature>Slice>TDD>RGR;content=schema→validator→provenance→PDF-fixture→mechanic→Foundry→pipeline→batch→per-record→regression;VSD=secondary;adventure=excluded.`

## PR-Classes (35;3 expandable)
Token=`P(test;runtime;authored-lines;rollback)`.

P1(T(foundation,rolls);S:manifest;390;RB:foundation+rolls) P2(T(authority,settings);S:registration;320;RB:gateway+settings) P3(T(content);N/A;280;RB:C/tools) P4(T(adapter);S:Actor/UI;360;RB:F/templates) P5(T(character);S:Actor;260;RB:D/character)
P6(T(skills);S:skills;340;RB:D/skills) P7(T(toughness);S:save;180;RB:D/toughness) P8(T(willpower);S:save;180;RB:D/willpower) P9(T(save-modifiers);S:save;220;RB:D/saves+F) P10(T(weapon);S:items;220;RB:Weapon)
P11(T(armor);S:items;220;RB:Armor) P12(T(melee);S:melee;260;RB:D/combat) P13(T(attack-table);S:attack;280;RB:C/attack) P14(T(attack-result);S:attack;220;RB:lookup) P15(T(critical-table);S:critical;340;RB:C/critical)
P16(T(critical-roll);S:critical;260;RB:D/critical) P17(T(hp);S:health;240;RB:D/health) P18(T(conditions);S:conditions;360;RB:D/conditions) P19(T(round-flow);S:rounds;340;RB:D/rounds) P20(T(round-ui);S:round-UI;360;RB:F/rounds)
P21(T(equipment-model);S:inventory;320;RB:D/equipment) P22(T(equipment-import);S:inventory;300;RB:C/equipment) P23(T(grimoire-infra);S:SpellLore;360;RB:C/grimoire) P24(T(spell-model);S:SpellLore;300;RB:D/spells) P25(T(spell-roll);S:casting;340;RB:D/spells)
P26(T(spell-effects);S:casting;360;RB:effects) P27(T(creation);S:creation;340;RB:D/creation) P28(T(creation-options);S:creation;360;RB:options) P29(T(advancement);S:advancement;340;RB:D/advancement) P30(T(travel);S:travel;300;RB:D/travel)
P31(T(bestiary-infra);S:Actor;360;RB:C/bestiary) P32+(T(bestiary-batch);S:required;120–300/batch;RB:batch) P33(T(grimoire-foundry-content-after-spell-mechanics);S:SpellLore;360;RB:C/grimoire) P34+(T(core-batch);S:required;120–300/batch;RB:batch) P35(T(all);S:full;280;RB:release)

## TDD-Leaves (112;RGR)
- [x] 1.1-FND-harness/build/.gitignore-verify
- [ ] 1.2-FND-manifest[compatibility.minimum=14.367,verified=14.367]/loading the generated installable package on exactly Foundry 14.367/wrong-build=NOT-VERIFIED
- [x] 1.3-FND-private-release-gates/Conventional-Commit
- [x] 1.4-FND-threat-RED
- [x] 1.5-Roll-missing/malformed-difficulty/modifiers/no-GM-inference
- [x] 1.6-Roll-trace/exact-supplied/resolved-inputs
- [x] 1.7-Roll-outcome/open-ended-order/replay
- [ ] 2.1-GM-gateway/pending-no-write
- [ ] 2.2-GM-confirm/authorized-success/bind-inputs
- [ ] 2.3-GM-confirm-malformed-unauthorized-reject/cancel/stale
- [ ] 2.4-Options-complete-PDF-registry
- [ ] 2.5-Options-each-world-boolean/default-false
- [ ] 2.6-Options-independent/no-cross-enable/intended-boundary
- [ ] 2.7-Options-Node-contracts/14.367-registration-receipt
- [ ] 3.1-Source-schema/record
- [ ] 3.2-Source-PDF-provenance/per-record
- [ ] 3.3-Source-canonical/136–140→SR90
- [ ] 3.4-Source-VSD-only-rejection
- [ ] 3.5-Source-adventure/package-rejection
- [ ] 4.1-F-Actor-TypeDataModel/registration
- [ ] 4.2-F-ApplicationV2-intended-update
- [ ] 4.3-F-ApplicationV2-unrelated-data-preserved
- [ ] 4.4-F-rendering/permissions
- [ ] 4.5-F-migration/lifecycle/exact-14.367-receipt
- [ ] 5.1-Character-Actor/base-model
- [ ] 5.2-Character-characteristics/derived
- [ ] 6.1-Skills-seven-categories
- [ ] 6.2-Skills-Magic-Points-bucket
- [ ] 6.3-Skills-individual
- [ ] 6.4-Skills-bonus
- [ ] 6.5-Skills-minimal-roll
- [ ] 7.1-Saves-Toughness
- [ ] 8.1-Saves-Willpower
- [ ] 9.1-Saves-modifiers/results
- [ ] 9.2-Saves-Foundry-mutation
- [ ] 10.1-Combat-Weapon-Item
- [ ] 11.1-Combat-Armor-Item
- [ ] 12.1-Combat-melee-bonus
- [ ] 12.2-Combat-melee-roll
- [ ] 13.1-Combat-AttackTable-schema
- [ ] 13.2-Combat-AttackTable-validator
- [ ] 14.1-Combat-AttackTable-lookup
- [ ] 14.2-Combat-attack-result
- [ ] 15.1-Combat-critical-determination
- [ ] 15.2-Combat-CriticalTable-schema
- [ ] 15.3-Combat-CriticalTable-validator
- [ ] 16.1-Combat-critical-roll
- [ ] 16.2-Combat-critical-lookup
- [ ] 16.3-Combat-fumble
- [ ] 17.1-Health-HP
- [ ] 17.2-Health-damage
- [ ] 18.1-Health-bleeding
- [ ] 18.2-Health-stun
- [ ] 18.3-Health-other-condition
- [ ] 18.4-Health-lifecycle
- [ ] 18.5-Health-recovery
- [ ] 19.1-Rounds-phase
- [ ] 19.2-Rounds-actions
- [ ] 19.3-Rounds-sequencing
- [ ] 20.1-Rounds-transitions
- [ ] 20.2-Rounds-GM-overrides
- [ ] 20.3-Rounds-Foundry-UI
- [ ] 21.1-Equipment-model
- [ ] 21.2-Equipment-inventory
- [ ] 21.3-Equipment-integration
- [ ] 22.1-Equipment-wealth
- [ ] 22.2-Equipment-import-validation
- [ ] 23.1-Grimoire-schema
- [ ] 23.2-Grimoire-model
- [ ] 23.3-Grimoire-validator
- [ ] 23.4-Grimoire-provenance
- [ ] 23.5-Grimoire-representative-fixture
- [ ] 24.1-Magic-SpellLore-model
- [ ] 24.2-Magic-Magic-Points
- [ ] 25.1-Magic-casting-roll
- [ ] 25.2-Magic-casting-table
- [ ] 25.3-Magic-136–140→SR90
- [ ] 26.1-Magic-costs
- [ ] 26.2-Magic-saves
- [ ] 26.3-Magic-duration
- [ ] 26.4-Magic-effects/state
- [ ] 26.5-Magic-Foundry-workflow
- [ ] 27.1-Creation-requirements
- [ ] 27.2-Creation-workflow
- [ ] 28.1-Creation-development-points
- [ ] 28.2-Creation-skill-development
- [ ] 28.3-Creation-MP-development
- [ ] 28.4-Creation-culture
- [ ] 28.5-Creation-vocation
- [ ] 28.6-Creation-background/options
- [ ] 28.7-Creation-validation
- [ ] 29.1-Advancement-rules
- [ ] 29.2-Advancement-UI
- [ ] 30.1-Travel-rules
- [ ] 30.2-Travel-content
- [ ] 31.1-Bestiary-schema
- [ ] 31.2-Bestiary-model
- [ ] 31.3-Bestiary-validator
- [ ] 31.4-Bestiary-provenance
- [ ] 31.5-Bestiary-representative-fixture
- [ ] 32.1-Bestiary-Foundry-integration
- [ ] 32.2-Bestiary-import-pipeline
- [ ] 32.3-Bestiary-bounded-PDF-batch
- [ ] 32.4-Bestiary-per-record-PDF-verification
- [ ] 32.5-Bestiary-full-pack-regression/reject-missing-E
- [ ] 33.1-Grimoire-Foundry-integration-after-spell-mechanics
- [ ] 33.2-Grimoire-import-pipeline
- [ ] 33.3-Grimoire-bounded-PDF-batch
- [ ] 33.4-Grimoire-per-record-PDF-verification
- [ ] 33.5-Grimoire-full-pack-regression/reject-missing-E
- [ ] 34.1-Core-reaction-fear-PDF-fixture/validator/lookup
- [ ] 35.1-Final-full-regression/package/privacy/reject-missing-E

## Threat-RED/Dependency-Trace
`Threats=docs:requirements.txt/CMakeLists.txt/executable-MD/MDX/README.sh;selectors:git-C/relative/absolute;states:staged/commit-a/empty-index;release:unknown-or-nonprivate/missing-auth/repository-tag-SHA-mismatch/privacy-before-mutation-upload-publication;push+PR:N/A.`
`Dependencies=game-state:P4–P34→P2;release:P1-gate;order:foundation→rolls→authority→source→Actor→skills→saves→combat→health→rounds→equipment→Bestiary→Grimoire-infra→magic→Grimoire-Foundry→Grimoire-content→creation→advancement→travel→core→final.`
`Trace=SF:R1/S1→1.1,R2/S2→1.2,R3/S3→1.3–1.4,R4/S4→1.3;RSG:R1/S1→3.1–3.2,R2/S2→3.3,R3/S3→3.4,R4/S4→3.5;DRR:R1/S1–2→1.6–1.7,R2/S3→1.5,R3/S4→1.5–1.7;FUI:R1/S1→4.1+4.5,R2/S2→4.2–4.3,R3/S3→4.5;GMA:R1/S1→2.1,R1/S2→2.2,R2/S3→2.4–2.5+2.7,R2/S4→2.6–2.7;CSC:R1/S1→5.1,5.2,6.1,6.2,6.3,6.4,6.5,7.1,8.1,9.1,9.2,10.1,11.1,12.1,12.2,13.1,13.2,14.1,14.2,15.1,15.2,15.3,16.1,16.2,16.3,17.1,17.2,18.1,18.2,18.3,18.4,18.5,19.1,19.2,19.3,20.1,20.2,20.3,21.1,21.2,21.3,22.1,22.2,23.1,23.2,23.3,23.4,23.5,24.1,24.2,25.1,25.2,25.3,26.1,26.2,26.3,26.4,26.5,27.1,27.2,28.1,28.2,28.3,28.4,28.5,28.6,28.7,29.1,29.2,30.1,30.2,31.1,31.2,31.3,31.4,31.5,32.1,32.2,32.3,32.4,32.5,33.1,33.2,33.3,33.4,33.5,34.1,R1/S2→3.5,35.1,R2/S3→6.1,6.2,6.3,6.4,6.5,28.1,28.2,28.3,28.4,28.5,28.6,28.7,29.1,29.2,R3/S4→32.5,33.5,35.1.`
