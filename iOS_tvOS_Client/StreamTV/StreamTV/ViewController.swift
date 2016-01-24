//
//  ViewController.swift
//  StreamTV
//
//  Created by Bogdan Vitoc on 1/22/16.
//  Copyright © 2016 Bogdan Vitoc. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var imageView: UIImageView!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        DataReceiver.sharedReceiver.receiveImages { (image: UIImage?) -> Void in
            self.imageView.image = image
        }
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

