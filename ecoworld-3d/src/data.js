// Data jenis sampah: [nama, kategori, tips, bayaran koin]
export const T=[['Botol plastik','Anorganik','Botol PET bisa didaur ulang bila dibilas dan dipisah dari tutupnya.',4],['Kaleng minuman','Anorganik','Kaleng aluminium dapat didaur ulang berkali-kali tanpa turun mutu.',4],['Kantong plastik','Anorganik','Kantong plastik sering termakan satwa laut. Biasakan membawa tas sendiri.',3],['Kardus basah','Anorganik','Kardus yang basah dan kotor sulit didaur ulang; keringkan dan pisahkan.',2],['Baterai bekas','B3','Baterai termasuk limbah B3. Jangan dibuang ke tempat sampah biasa; serahkan ke titik pengumpulan khusus.',10],['Kulit pisang','Organik','Sampah organik bisa dikomposkan menjadi pupuk.',2]];

// Bahaya dan manfaat pengolahan, urutannya sama dengan T
export const INFO=[['Butuh ratusan tahun untuk terurai dan pecah menjadi mikroplastik yang dimakan ikan, lalu masuk ke rantai makanan manusia.','Didaur ulang menjadi serat pakaian, wadah baru, dan paving; menghemat minyak bumi dan energi.'],
['Logamnya mencemari tanah, tepinya bisa melukai kaki, dan butuh waktu sangat lama untuk lapuk.','Daur ulang aluminium menghemat sekitar 90% energi dibanding membuat baru, dan kaleng bernilai jual.'],
['Dikira ubur-ubur oleh penyu dan ikan, menyumbat pencernaan hewan, serta menyumbat saluran air hingga memicu banjir.','Bisa diolah menjadi biji plastik, paving block, atau bahan bakar alternatif; mengurangi timbunan di TPA.'],
['Kardus basah membusuk, mengundang kuman, dan menyumbat saluran air; bila dibakar menghasilkan asap berbahaya.','Kardus yang kering didaur ulang menjadi kertas dan kemasan baru, menghemat pohon dan air.'],
['Mengandung logam berat (merkuri, timbal, kadmium) yang meresap ke tanah dan air, merusak saraf dan ginjal, serta mencemari ikan.','Jika dikelola khusus, logam berharganya dapat dipulihkan dan zat beracunnya dinetralkan dengan aman.'],
['Membusuk menghasilkan gas metana (gas rumah kaca) dan bau, serta mengundang lalat dan tikus.','Dikomposkan menjadi pupuk organik yang menyuburkan tanah dan mengurangi gas metana di TPA.']];

// Perlengkapan: [kunci, nama, efek]
export const UP=[['spd','Sepatu lapangan','Berjalan lebih cepat'],['cap','Karung lebih besar','+3 kapasitas'],['reach','Penjepit sampah','Jangkauan pungut lebih jauh'],['bonus','Sarung tangan kerja','+15% koin per daur ulang']];

// Nama tier per level (Lv 0 sampai 5), dipakai di menu Perlengkapan
export const TIER={spd:['Sandal jepit','Sepatu kets','Sepatu trail','Boot karet','Boot kulit','Boot pro'],cap:['Tas kain','Karung goni','Karung goni besar','Ransel kanvas','Ransel rangka','Ransel ekspedisi'],reach:['Tangan kosong','Penjepit aluminium','Penjepit gagang oranye','Penjepit oranye','Penjepit teleskopik','Penjepit karbon'],bonus:['Tangan kosong','Sarung kain','Sarung kanvas karet','Sarung karet oranye','Sarung kulit','Sarung taktis']};
